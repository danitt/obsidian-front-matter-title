import { mock, mockReset } from "jest-mock-extended";
import { MarkdownLeaf, MarkdownView, TFile, WorkspaceLeaf } from "obsidian";
import ObsidianFacade from "@src/Obsidian/ObsidianFacade";
import TabManager from "@src/Feature/Tab/TabManager";
import { ResolverInterface } from "@src/Resolver/Interfaces";
import EventDispatcherInterface from "@src/Components/EventDispatcher/Interfaces/EventDispatcherInterface";
import { AppEvents } from "@src/Types";
import { ObsidianActiveFile } from "@config/inversify.factory.types";
import { Leaves } from "@src/Enum";

const facadeMock = mock<ObsidianFacade>();
const dispatcherMock = mock<EventDispatcherInterface<AppEvents>>();
const resolver = mock<ResolverInterface>();
const factory: jest.MockedFunction<ObsidianActiveFile> = jest.fn();

type TitleEl = { getText: () => string; setText: (v: string) => void };

const createTitleEl = (initial = ""): TitleEl => {
    let text = initial;
    return {
        getText: () => text,
        setText: (v: string) => {
            text = v;
        },
    };
};

/**
 * Builds a markdown leaf whose prototype carries the `setPinned`/`updateHeader` methods
 * Obsidian uses to (re)render the tab header. `TabManager` patches that prototype.
 */
const createLeaf = (path: string, titleEl: TitleEl): MarkdownLeaf => {
    const proto = {
        setPinned(): void {},
        updateHeader(this: any): void {
            // Mimic Obsidian reverting the tab title back to the file basename.
            this.tabHeaderInnerTitleEl.setText(this.view.file.basename);
        },
    };
    const file = Object.assign(new TFile(), { path, basename: "20240101120000" });
    const view = Object.assign(Object.create(mock<MarkdownView>()), {
        file,
        getViewType: () => Leaves.MD,
        getState: () => ({ file: path }),
    });
    return Object.assign(Object.create(proto), {
        tabHeaderInnerTitleEl: titleEl,
        view,
    });
};

describe("TabManager", () => {
    let manager: TabManager;

    beforeEach(() => {
        mockReset(facadeMock);
        mockReset(dispatcherMock);
        mockReset(resolver);
        factory.mockReset();
        manager = new TabManager(facadeMock, dispatcherMock, factory);
        manager.setResolver(resolver);
    });

    it("re-applies the resolved title after Obsidian's updateHeader reverts it", () => {
        const path = "notes/20240101120000.md";
        const titleEl = createTitleEl("");
        const leaf = createLeaf(path, titleEl);
        resolver.resolve.mockReturnValue("My Front Matter Title");
        facadeMock.getActiveLeaf.mockReturnValue(leaf as unknown as WorkspaceLeaf);
        facadeMock.getLeavesOfType.mockReturnValue([leaf]);

        manager.enable();

        // Obsidian fires updateHeader on tab focus/blur/active-leaf-change, reverting to basename.
        (leaf as any).updateHeader();

        expect(titleEl.getText()).toBe("My Front Matter Title");
    });

    it("restores the vanilla behaviour on disable", () => {
        const path = "notes/20240101120000.md";
        const titleEl = createTitleEl("");
        const leaf = createLeaf(path, titleEl);
        resolver.resolve.mockReturnValue("My Front Matter Title");
        facadeMock.getActiveLeaf.mockReturnValue(leaf as unknown as WorkspaceLeaf);
        facadeMock.getLeavesOfType.mockReturnValue([leaf]);

        manager.enable();
        manager.disable();

        // With the patch removed, updateHeader must leave the basename in place.
        (leaf as any).updateHeader();

        expect(titleEl.getText()).toBe("20240101120000");
    });
});
