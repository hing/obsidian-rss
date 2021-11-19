import {BaseModal} from "./BaseModal";
import RssReaderPlugin from "../main";
import {Setting, TextComponent} from "obsidian";
import {TextInputPrompt} from "./TextInputPrompt";
import {NUMBER_REGEX, TAG_REGEX} from "../consts";

export class TagModal extends BaseModal {
    plugin: RssReaderPlugin;
    tags: string[];

    constructor(plugin: RssReaderPlugin, tags: string[]) {
        super(plugin.app);
        this.plugin = plugin;
        this.tags = tags;
    }

    display(): void {
        const {contentEl} = this;
        contentEl.empty();

        contentEl.createEl("h1", {text: "Edit Tags"});

        const tagDiv = contentEl.createDiv("tags");

        for (const tag in this.tags) {
            const setting = new Setting(tagDiv);

            setting.setName(this.tags[tag]);

            setting.addExtraButton((b) => {
                b
                    .setIcon("trash")
                    .setTooltip("Delete")
                    .onClick(() => {
                        this.tags = this.tags.filter(e => e !== this.tags[tag]);
                        console.log("new tags " + this.tags);
                        this.display();
                    });
            });
        }
        const buttonEl = contentEl.createSpan("actionButtons");

        const buttons = new Setting(buttonEl).addButton((btn) => btn.setButtonText("new").onClick(async () => {
            const input = await new TextInputPrompt(this.app, "Tag", "new tag name", "", "tag name");
            let textInput: TextComponent;
            input.openAndGetValue((value => {
                textInput = value;
                if(!value.getValue().match(TAG_REGEX) || value.getValue().match(NUMBER_REGEX) || value.getValue().contains(" ") || value.getValue().contains('#')) {
                    input.setValidationError(textInput, "This is not a valid tag");
                    return;
                }
                this.tags.push(value.getValue());
                this.display();
                input.close();
            }));
        }));

        buttons.addExtraButton((btn) => btn.setTooltip("Save").setIcon("checkmark").onClick(async () => {
            this.close();
        }));
    }

    onClose() : void {
        const {contentEl} = this;
        contentEl.empty();
    }

    async onOpen() : Promise<void> {
        await this.display();
    }

}
