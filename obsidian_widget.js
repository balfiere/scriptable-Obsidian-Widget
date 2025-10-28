// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;

//=============================================================================
// 1. Constants & Configurations
//=============================================================================

// == Basic Display Settings =============================================================
const isPhone = true; // Specify the device (true: iPhone, false: iPad)
const USE_FULL_WIDTH_CHARS = false; // Set to true if your note primarily uses full-width characters like Japanese, Chinese, or Korean. This adjusts line wrapping calculations.
const FONT_SIZE = 12; // Font size
const LINE_SPACING = 2; // Line spacing
const START_STRING = '### To Do'; // Content before this string will not be displayed in the widget. If empty, start from the first line after the frontmatter
const PARTITION_STRING = '### What I Accomplished Today'; // This string and its following content will not be displayed in the widget
const SHOW_FIRSTLINE_AS_PLAINTEXT = false; // Whether to display the first line as plain text (if false, special styles are applied)
const SHOW_FILENAME_ON_FIRSTLINE = true; // Whether to display the file name on the first line
const SHOW_TASK_NUMBER = true; // Whether to display the number of incomplete tasks

// == Color and Style Settings ========================================================
// Widget background color
const DARK_BACKGROUND_COLOR = '1C1C1E';// 
const LIGHT_BACKGROUND_COLOR = 'FFFFFF';

// Widget background image
const BACKGROUND_IMAGE = false;
const BACKGROUND_IMAGE_NAME = 'image.jpg';

// Color and opacity for the first line items
const FIRST_LINE_COLOR_LIGHT = '#0088FF';// 
const FIRST_LINE_COLOR_DARK = '#0091FF';

const FIRST_LINE_ALPHA = 'E6'; // Hexadecimal (E6 = 90%)
const FIRST_LINE_TASK_ALPHA = SHOW_TASK_NUMBER ? '66' : '00'; // Hexadecimal (66 = 40%)

// == Advanced Internal Settings =========================================================
const FRONTMATTER_STRING = '---'; // Delimiter for Obsidian's front matter
const BASE_FONT_SIZE = 13; // Base font size for style calculations
const SIZE_FACTOR = FONT_SIZE / BASE_FONT_SIZE; // Scaling factor used for position adjustments with font size changes
const TAB_SPACE_SIZE = 14 * SIZE_FACTOR; // Space size for one indent (tab)
const MAX_LINE_WIDTH_OFFSET = USE_FULL_WIDTH_CHARS && FONT_SIZE > 12 || !USE_FULL_WIDTH_CHARS && FONT_SIZE > 14 ? 1 : 0; // Offset to fine-tune the maximum line width
const MAX_LINE_WIDTH = isPhone ? getWidgetConfigByFamily().maxLineWidth_iPhone : getWidgetConfigByFamily().maxLineWidth_iPad; // Maximum number of half-width characters per line (approximate)

// Global variables for state management
let LINE_COUNT = 0; // Count the number of lines to display
let H1_COUNT = 0;   // Count the number of h1 headings (used for line limit calculation)
let H2_COUNT = 0;   // Count the number of h2 headings
let H3_COUNT = 0;   // Count the number of h3 headings

// Object to centrally manage style information for each element
const CONFIG = {
    // Style for each text type
    h1:     { fontSizeScale: 1.3, color_light: Color.black(), color_dark: Color.white() },
    h2:     { fontSizeScale: 1.2, color_light: Color.black(), color_dark: Color.white() },
    h3:     { fontSizeScale: 1.1, color_light: Color.black(), color_dark: Color.white() },
    todo:   { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    done:   { fontSizeScale: 1,   color_light: Color.darkGray(), color_dark: Color.lightGray() },
    cancelled:   { fontSizeScale: 1,   color_light: Color.lightGray(), color_dark: Color.darkGray() },
    forwarded: { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    inprogress: { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    bullet: { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    number: { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    text:   { fontSizeScale: 1,   color_light: Color.black(), color_dark: Color.white() },
    bold:   { fontSizeScale: 1 },
    italic: { fontSizeScale: 1 },
    url:    {
        color_light: new Color(`${FIRST_LINE_COLOR_LIGHT}${FIRST_LINE_ALPHA}`),
        color_dark: new Color(`${FIRST_LINE_COLOR_DARK}${FIRST_LINE_ALPHA}`)
    },
    firstLineText: {
        fontSizeScale: 1.3,
        color_light: new Color(`${FIRST_LINE_COLOR_LIGHT}${FIRST_LINE_ALPHA}`),
        color_dark: new Color(`${FIRST_LINE_COLOR_DARK}${FIRST_LINE_ALPHA}`)
    },
    // Style for each image/icon
    todoImage: {
        topPadding: 0.7, bottomPadding: 0, rightMargin: 2, leftMargin: 0, imageSizeScale: 1.1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    doneImage: {
        topPadding: 0.7, bottomPadding: 0, rightMargin: 2, leftMargin: 0, imageSizeScale: 1.1,
        color_light: Color.green(), color_dark: Color.green()
    },
    cancelledImage: {
        topPadding: 0.7, bottomPadding: 0, rightMargin: 2, leftMargin: 0, imageSizeScale: 1.1,
        color_light: Color.darkGray(), color_dark: Color.darkGray()
    },
    forwardedImage: {
        topPadding: 0.7, bottomPadding: 0, rightMargin: 2, leftMargin: 0, imageSizeScale: 1.1,
        color_light: Color.lightGray(), color_dark: Color.lightGray()
    },
    inprogressImage: {
        topPadding: 0.7, bottomPadding: 0, rightMargin: 2, leftMargin: 0, imageSizeScale: 1.1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    bulletImage: {
        topPadding: 2 * SIZE_FACTOR, bottomPadding: 0, rightMargin: 1, leftMargin: 0, imageSizeScale: 1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    numberImage: {
        topPadding: 3.5 * SIZE_FACTOR, bottomPadding: 1, rightMargin: 0, leftMargin: 0,
        spacing: 0.3, imageSizeScale: 0.7,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    dotImage: {
        topPadding: 0.6, bottomPadding: 0, rightMargin: 4, leftMargin: 0.7, imageSizeScale: 0.9,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    reloadIconImage: {
        topPadding: 0, bottomPadding: 0, rightMargin: 0, leftMargin: 0, imageSizeScale: 1,
        color_light: Color.lightGray(), color_dark: Color.darkGray()
    },
    taskNum: {
        topPadding: SHOW_FIRSTLINE_AS_PLAINTEXT ? 2 * SIZE_FACTOR : 5.5 * SIZE_FACTOR,
        bottomPadding: 0, rightMargin: 0, leftMargin: 0,
        spacing: 0.3, leftSpacing: 3, imageSizeScale: 0.7,
        color_light: new Color(`${FIRST_LINE_COLOR_LIGHT}${FIRST_LINE_TASK_ALPHA}`),
        color_dark: new Color(`${FIRST_LINE_COLOR_DARK}${FIRST_LINE_TASK_ALPHA}`),
    }
};

//=============================================================================
// 2. Obsidian Integration
//=============================================================================

const iCloud = FileManager.iCloud();

// let the widget parameter be the date format of the daily note's file name
// default format is yyyy-MM-dd
let format = args.widgetParameter || "yyyy-MM-dd";

let now = new Date();
let formatter = new DateFormatter();
formatter.locale = "en_US";
formatter.dateFormat = format;
let today = formatter.string(now);

let noteName = today;

const bookmarkedFolderName = 'daily notes'; // Set the folder name configured in File Bookmarks here
const vaultPath = iCloud.bookmarkedPath(bookmarkedFolderName);
const targetNoteName = `${noteName}.md`;
const targetNotePath = `${vaultPath}/${targetNoteName}`;

// URL scheme for the Obsidian note to open when the widget is tapped
// const targetNoteUrl = `obsidian://open?vault=${encodeURIComponent(bookmarkedFolderName)}&file=${encodeURIComponent(noteName)}`;
const targetNoteUrl = `obsidian://daily`;

//=============================================================================
// 3. Main Execution
//=============================================================================

// Async function to execute the main process
(async () => {
    // If the widget parameter is not set, display an error message and exit
    // if (!args.widgetParameter && config.runsInWidget) {
    //     const message = ['Widget parameter is not set.', 'Please enter the filename in the Parameter of the widget settings.'];
    //     const errorWidget = handleError(message);
    //     Script.setWidget(errorWidget);
    //     return;
    // }

    // If the target note file does not exist, try to create it using obsidian's uri. if failed, display an error message and exit
    if (!iCloud.fileExists(targetNotePath)) {
        let success = Safari.open("obsidian://daily");
        if (!success) {
            const message = [`Note not found:`, `${targetNoteName}`, " and couldn't be created."];
            const errorWidget = handleError(message);
            Script.setWidget(errorWidget);
            return;
        }
    }

    // Read data from the note file and generate the widget
    const noteContent = iCloud.readString(targetNotePath);
    const { memos, isTextExist, numberOfTasks } = extractMemoData(noteContent);

    let widget;
    if (!isTextExist) {
        // Create a widget for when there is no text to display
        const message = SHOW_TASK_NUMBER ? 'All tasks completed!' : 'Text not found.';
        widget = handleNoText(message);
    } else {
        // Create a normal widget
        widget = createWidget(memos, targetNoteUrl, numberOfTasks);
    }

    // Display (or preview) the widget
    if (config.runsInWidget) {
        Script.setWidget(widget);
    } else {
        widget.presentLarge();
    }

    Script.complete();
})();


//=============================================================================
// 4. Function Definitions
//=============================================================================

// 4-1. Main Widget Creation Functions
//-----------------------------------------------------------------------------

/**
 * @summary Generates the entire widget from note data.
 * @param {string[]} memos - An array containing each line of the note to be displayed.
 * @param {string} noteUrl - The URL to open the note in Obsidian.
 * @param {number} numberOfTasks - The number of incomplete tasks.
 * @returns {ListWidget} The generated widget object.
 */
function createWidget(memos, noteUrl, numberOfTasks) {
    const widget = new ListWidget();
    widget.setPadding(15, 18, 15, 12);
    widget.url = noteUrl;

    if (BACKGROUND_IMAGE === false) {
        widget.backgroundColor = Color.dynamic(new Color(LIGHT_BACKGROUND_COLOR), new Color(DARK_BACKGROUND_COLOR));
    } else {
        const directoryName = 'Images'; // The folder where images are stored
        const path = iCloud.joinPath(iCloud.joinPath(iCloud.documentsDirectory(), directoryName), BACKGROUND_IMAGE_NAME);
        widget.backgroundImage = iCloud.readImage(path);
    }

    const mainStack = widget.addStack();
    mainStack.layoutVertically();
    mainStack.spacing = LINE_SPACING;

    let isFirstLine = true;

    for (const memo of memos) {
        LINE_COUNT++; // Increment the current line count
        const LINE_LIMIT = isPhone ? getWidgetConfigByFamily().lineLimit_iPhone() : getWidgetConfigByFamily().lineLimit_iPad();
        if (LINE_COUNT > LINE_LIMIT) {
            break; // Break the loop if the line limit is reached
        }

        // Parse the line
        const { type, replacedText, indentLevel, number_str } = parseMemoLine(memo);
        if (type[0] === 'h1') H1_COUNT++;
        else if (type[0] === 'h2') H2_COUNT++;
        else if (type[0] === 'h3') H3_COUNT++;

        addLineToWidget(mainStack, type, replacedText, indentLevel, number_str, isFirstLine, numberOfTasks);
        isFirstLine = false;
    }

    widget.addSpacer();
    return widget;
}

/**
 * @summary Creates a widget to display in case of an error.
 * @param {string[]} message - An array of error messages to display.
 * @returns {ListWidget} A widget object containing the error message.
 */
function handleError(message) {
    const widget = new ListWidget();
    for (let line of message) {
        const widgetText = widget.addText(line);
        widgetText.centerAlignText();
        widgetText.textColor = Color.dynamic(CONFIG.text.color_light, CONFIG.text.color_dark);
    }
    return widget;
}

/**
 * @summary Creates a widget to display when there is no text.
 * @param {string} message - The message to display.
 * @returns {ListWidget} A widget object containing the message and a reload icon.
 */
function handleNoText(message) {
    const widget = new ListWidget();
    widget.url = targetNoteUrl;
    const mainStack = widget.addStack();
    mainStack.layoutVertically();

    // Add a reload icon at the top
    const reloadIconStack = mainStack.addStack();
    reloadIconStack.layoutHorizontally();
    reloadIconStack.addSpacer();
    addReloadIcon(reloadIconStack, CONFIG.reloadIconImage);
    mainStack.addSpacer();

    // Add the message text in the center
    const textStack = mainStack.addStack();
    textStack.addSpacer();
    const textElement = textStack.addText(message);
    textElement.textColor = Color.dynamic(CONFIG.text.color_light, CONFIG.text.color_dark);
    textStack.addSpacer();

    mainStack.addSpacer();
    return widget;
}


// 4-2. Data Processing & Text Parsing Functions
//-----------------------------------------------------------------------------

/**
 * @summary Extracts the data necessary for widget display from an Obsidian note string.
 * @description Excludes front matter and completed tasks, and retrieves content up to the specified delimiter string.
 * @param {string} noteString - The full content of the Obsidian note.
 * @returns {{memos: string[], isTextExist: boolean, numberOfTasks: number}} An object containing the extracted note data, a flag for text existence, and the task count.
 */
function extractMemoData(noteString) {
    const lines = noteString.split('\n');
    let sliceIndex = 0;
    
    // Skip the front matter section
    if (lines[0] === FRONTMATTER_STRING) {
        lines.shift();
        sliceIndex = lines.indexOf(FRONTMATTER_STRING) + 1;
    }

    // Keep removing lines until the START_STRING is found
    if (START_STRING !== '' && lines[sliceIndex] !== START_STRING) {
        while (lines[sliceIndex] !== START_STRING) {
            lines.shift();
            sliceIndex++;
        }
    }
    
    const contentLines = lines.slice(sliceIndex);
    
    // Determine if there is text to display
    let isTextExist = !(contentLines.length < 2 && contentLines[0] === '');
    
    // Get content up to the PARTITION_STRING
    const partitionIndex = contentLines.indexOf(PARTITION_STRING);
    const relevantLines = partitionIndex === -1 ? contentLines : contentLines.slice(0, partitionIndex);

    // Exclude completed tasks ("- [x]")
    let filteredLines = relevantLines.filter(line => !line.includes("- [x]"));
    
    // Count incomplete tasks ("- [ ]")
    const numberOfTasks = filteredLines.filter(item => item.includes("- [ ] ")).length;

    // Add the file name to the first line based on the setting
    if (SHOW_FILENAME_ON_FIRSTLINE) {
        // filteredLines.unshift(noteName);
        relevantLines.unshift(noteName);
    }
    
    // If all filtered lines are empty, consider it as no text
    // if (filteredLines.every(line => line.trim() === '')) {
    if (relevantLines.every(line => line.trim() === '')) {
        isTextExist = false;
    }

    // return { memos: filteredLines, isTextExist, numberOfTasks };
    return { memos: relevantLines, isTextExist, numberOfTasks };
}

/**
 * @summary Parses a single line of the note to get its type, text, indent level, etc.
 * @param {string} memoLine - The line of the note to be parsed.
 * @returns {{type: string[], replacedText: string[], indentLevel: number, number_str: string}} The parsing result.
 */
function parseMemoLine(memoLine) {
    const regexTab = /^\t+/;
    const regexHeading = /^(#+) /;
    const regexTodo = /^- \[ \] /;
    const regexDone = /^- \[x\] /;
    const regexCancelled = /^- \[-\] /;
    const regexForwarded = /^- \[>\] /;
    const regexInProgress = /^- \[\/\] /;
    const regexBullet = /^(?:-|\*)\s/;
    const regexNumber = /^\d+\.\s/;
    
    // Count and remove indentation (tabs)
    const indentLevel = (memoLine.match(regexTab) || [''])[0].length;
    const textWithoutIndent = memoLine.replace(regexTab, '');

    let type = [];
    let replacedText = [];
    let number_str = '0';

    // Determine the line type based on the starting symbols
    if (regexHeading.test(textWithoutIndent)) {
        const headingPrefix = textWithoutIndent.match(regexHeading)[0];
        type.push(`h${headingPrefix.length - 1}`); // h1, h2, h3
        replacedText.push(textWithoutIndent.replace(headingPrefix, ''));
    } else if (regexTodo.test(textWithoutIndent)) {
        type.push('todo');
        replacedText.push(textWithoutIndent.replace(regexTodo, ''));
    } else if (regexDone.test(textWithoutIndent)) {
        type.push('done');
        replacedText.push(textWithoutIndent.replace(regexDone, ''));
    } else if (regexCancelled.test(textWithoutIndent)) {
        type.push('cancelled');
        replacedText.push(textWithoutIndent.replace(regexCancelled, ''));
    } else if (regexForwarded.test(textWithoutIndent)) {
        type.push('forwarded');
        replacedText.push(textWithoutIndent.replace(regexForwarded, ''));
    } else if (regexInProgress.test(textWithoutIndent)) {
        type.push('inprogress');
        replacedText.push(textWithoutIndent.replace(regexInProgress, ''));
    } else if (regexBullet.test(textWithoutIndent)) {
        type.push('bullet');
        replacedText.push(textWithoutIndent.replace(regexBullet, ''));
    } else if (regexNumber.test(textWithoutIndent)) {
        type.push('number');
        number_str = textWithoutIndent.match(regexNumber)[0].replace(/\.\s/, '');
        replacedText.push(textWithoutIndent.replace(regexNumber, ''));
    } else {
        type.push('text');
        replacedText.push(textWithoutIndent);
    }
    
    // Check for inline styles (bold, italic, links, etc.)
    const regexInline = /\*\*(.*?)\*\*|(?<!\*)\*(?!\*)(.*?)\*(?!\*)|\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]|(https?:\/\/[^\s\]\)\}\>,]+)/g;
    if (regexInline.test(replacedText[0])) {
        type.push('inline');
        // Split the text into styled and normal parts
        replacedText = splitWithMatches(replacedText[0]);
    }

    return { type, replacedText, indentLevel, number_str };
}

/**
 * @summary Splits a string by inline styles (bold, italic, links).
 * @param {string} str - The string to be split.
 * @returns {string[]} An array containing alternating styled and normal parts.
 */
function splitWithMatches(str) {
    const regex = /\*\*(.*?)\*\*|(?<!\*)\*(?!\*)(.*?)\*(?!\*)|\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]|(https?:\/\/[^\s\]\)\}\>,]+)/g;
    const matches = [...str.matchAll(regex)];
    let lastIndex = 0;
    const result = [];

    for (const match of matches) {
        // Add the non-matching part (normal text)
        if (match.index > lastIndex) {
            result.push(str.slice(lastIndex, match.index));
        }
        // Add the matching part (styled text)
        result.push(match[0]);
        lastIndex = match.index + match[0].length;
    }
    // Add the final non-matching part
    if (lastIndex < str.length) {
        result.push(str.slice(lastIndex));
    }
    return result;
}

/**
 * @summary Determines the inline style of a string (bold, italic, link).
 * @param {string} string - The string to be evaluated.
 * @returns {{textType: string, text: string, url: string}} The style type, display text, and URL.
 */
function getTypeOfInline(string) {
    const boldMatch = string.match(/^\*\*(.*?)\*\*$/);
    const italicMatch = string.match(/^\*(.*?)\*$/);
    const urlMatch = string.match(/\[([^\]]+)\]\(([^)]+)\)|\[\[([^\]]+)\]\]|(https?:\/\/[^\s\]\)\}\>,]+)/);

    if (boldMatch) {
        return { textType: "bold", text: boldMatch[1], url: '' };
    }
    if (italicMatch) {
        return { textType: "italic", text: italicMatch[1], url: '' };
    }
    if (urlMatch) {
        if (urlMatch[1] && urlMatch[2]) { // [text](url)
            return { textType: "url", text: urlMatch[1], url: urlMatch[2] };
        }
        if (urlMatch[3]) { // [[text]]
            const file = encodeURIComponent(urlMatch[3]);
            const vault = encodeURIComponent(bookmarkedFolderName);
            return { textType: "url", text: urlMatch[3], url: `obsidian://open?vault=${vault}&file=${file}` };
        }
        if (urlMatch[4]) { // http(s)://...
            return { textType: "url", text: urlMatch[4], url: urlMatch[4] };
        }
    }
    // If no style matches, it's plain text
    return { textType: "text", text: string, url: '' };
}


// 4-3. UI Element Rendering Helper Functions
//-----------------------------------------------------------------------------

/**
 * @summary Adds one line of UI elements (indent, marker, text) to the widget.
 * @param {WidgetStack} mainStack - The main container stack.
 * @param {string[]} type - The type of the line (e.g., ['h1'], ['todo', 'inline']).
 * @param {string[]} replacedText - An array of text split by style.
 * @param {number} indentLevel - The indentation level.
 * @param {string} number_str - The number for a numbered list.
 * @param {boolean} isFirstLine - A flag indicating if it's the first line.
 * @param {number} numberOfTasks - The number of incomplete tasks.
 */
function addLineToWidget(mainStack, type, replacedText, indentLevel, number_str, isFirstLine, numberOfTasks) {
    const lineStack = mainStack.addStack();
    lineStack.layoutHorizontally();

    // Add indentation
    lineStack.addSpacer(indentLevel * TAB_SPACE_SIZE);

    // Add list markers (checkbox, bullet, number)
    let listMarkerWidth = 0;
    if (['todo', 'done', 'cancelled', 'forwarded', 'inprogress', 'bullet', 'number'].includes(type[0])) {
        listMarkerWidth = 4; // Reserve width for the marker (approximate half-width characters)
        addListMarker(lineStack, CONFIG[`${type[0]}Image`], type[0], number_str);
    }

    // Create a container stack for rendering text
    const textContainerStack = lineStack.addStack();
    textContainerStack.layoutVertically();
    let currentLineStack = textContainerStack.addStack();
    currentLineStack.layoutHorizontally();
    let addedText = '';

    // Render the text parts sequentially
    for (const item of replacedText) {
        if (LINE_COUNT > (isPhone ? getWidgetConfigByFamily().lineLimit_iPhone() : getWidgetConfigByFamily().lineLimit_iPad())) break;
        
        const { textType, text, url } = getTypeOfInline(item);
        const textFontSize = isFirstLine && !SHOW_FIRSTLINE_AS_PLAINTEXT ? FONT_SIZE * CONFIG.firstLineText.fontSizeScale : FONT_SIZE * CONFIG[type[0]].fontSizeScale;
        const textColor = isFirstLine && !SHOW_FIRSTLINE_AS_PLAINTEXT ? Color.dynamic(CONFIG.firstLineText.color_light, CONFIG.firstLineText.color_dark) : Color.dynamic(CONFIG[type[0]].color_light, CONFIG[type[0]].color_dark);
        const urlColor = Color.dynamic(CONFIG.url.color_light, CONFIG.url.color_dark);
        const isBold = (isFirstLine && !SHOW_FIRSTLINE_AS_PLAINTEXT) || ['h1', 'h2', 'h3'].includes(type[0]) || textType === 'bold';
        const isItalic = textType === 'italic';
        const isURL = textType === 'url';
        const indentWidth = 2;
        
        const maxLineWidth = MAX_LINE_WIDTH - (indentLevel * indentWidth) - listMarkerWidth;
        const fullWidthCharSize = getWidgetConfigByFamily().fullWidthCharSize;

        ({ addedText, singleLineStack: currentLineStack } = addMultilineStyledText(
            textContainerStack, currentLineStack, text, addedText, maxLineWidth, fullWidthCharSize,
            { isBold, isItalic, isURL, textFontSize, textColor, url, urlColor }
        ));
    }

    // Add task count to the first line
    if (isFirstLine && numberOfTasks > 0) {
        lineStack.addSpacer(CONFIG.taskNum.leftSpacing);
        addNumberImage(lineStack, CONFIG.taskNum, 'taskNum', String(numberOfTasks));
    }

    lineStack.addSpacer(); // Left-align each line

    // Add reload icon to the first line
    if (isFirstLine) {
        addReloadIcon(lineStack, CONFIG.reloadIconImage);
        lineStack.addSpacer(3);
        if (!SHOW_FIRSTLINE_AS_PLAINTEXT) {
            mainStack.addSpacer(3); // Add extra space between the first and second lines
        }
    }
}


/**
 * @summary Renders styled text with automatic line wrapping.
 * @description If the text doesn't fit in one line, it renders the part that fits and recursively calls itself with the remaining text on a new line.
 * @param {WidgetStack} parentStack - The parent stack for adding new lines.
 * @param {WidgetStack} childStack - The current line's stack.
 * @param {string} nextText - The next text to render.
 * @param {string} addedText - Text already added to the current line.
 * @param {number} maxLineWidth - The maximum width of a line (in half-width characters).
 * @param {number} fullWidthCharSize - The half-width equivalent size of a full-width character.
 * @param {object} styles - The style information for the text.
 * @returns {{addedText: string, singleLineStack: WidgetStack}} The updated added text and the last line stack used.
 */
function addMultilineStyledText(parentStack, childStack, nextText, addedText, maxLineWidth, fullWidthCharSize, styles) {
    const addedTextWidth = sliceByDisplayWidth(addedText, maxLineWidth, fullWidthCharSize).width;
    const remainingWidth = maxLineWidth - addedTextWidth;
    const nextTextInfo = sliceByDisplayWidth(nextText, remainingWidth, fullWidthCharSize);

    // If the text fits in the current line
    if (!nextTextInfo.tail) {
        addStyledTextToStack(childStack, nextText, styles);
        return {
            addedText: addedText + nextText,
            singleLineStack: childStack,
        };
    }

    // If the text does not fit
    addStyledTextToStack(childStack, nextTextInfo.head, styles);
    LINE_COUNT++; // Increment line count due to wrapping
    
    // Check line limit
    const LINE_LIMIT = isPhone ? getWidgetConfigByFamily().lineLimit_iPhone() : getWidgetConfigByFamily().lineLimit_iPad();
    if (LINE_COUNT > LINE_LIMIT) {
        return { addedText: addedText + nextText, singleLineStack: childStack };
    }
    
    // Create a new line and recursively call for the remaining text
    const newStack = parentStack.addStack();
    newStack.layoutHorizontally();
    return addMultilineStyledText(parentStack, newStack, nextTextInfo.tail, '', maxLineWidth, fullWidthCharSize, styles);
}

/**
 * @summary Adds text with a specified style to a stack.
 * @param {WidgetStack} stack - The stack to add the text to.
 * @param {string} text - The text to display.
 * @param {object} styles - Style information (isBold, isItalic, isURL, textFontSize, textColor, url, urlColor).
 */
function addStyledTextToStack(stack, text, styles) {
    const { isBold, isItalic, isURL, textFontSize, textColor, url, urlColor } = styles;
    const textElement = stack.addText(text);

    if (isBold) {
        textElement.font = isItalic ? new Font('HelveticaNeue-BoldItalic', textFontSize) : Font.boldSystemFont(textFontSize);
    } else if (isItalic) {
        textElement.font = Font.italicSystemFont(textFontSize);
    } else {
        textElement.font = Font.regularSystemFont(textFontSize);
    }
    
    if (isURL) {
        textElement.textColor = urlColor;
        textElement.url = url;
    } else {
        textElement.textColor = textColor;
    }
}

/**
 * @summary Splits a string by a specified display width.
 * @description Determines the split point considering the widths of full-width and half-width characters.
 * @param {string} str - The string to be split.
 * @param {number} maxWidth - The maximum width (in half-width characters).
 * @param {number} fullWidthCharSize - The half-width equivalent size of a full-width character.
 * @returns {{head: string, tail: string|null, width: number}} The split head, the remainder, and the width of the head.
 */
function sliceByDisplayWidth(str, maxWidth, fullWidthCharSize) {
    let width = 0;
    let cutIndex = 0;
    for (const [i, char] of Array.from(str).entries()) {
        // Treat characters outside the ASCII range as full-width
        const charWidth = char.match(/[^\x01-\x7E]/) ? fullWidthCharSize : 1;
        if (width + charWidth > maxWidth) break;
        width += charWidth;
        cutIndex = i + 1;
    }
    const head = str.slice(0, cutIndex);
    const tail = cutIndex < [...str].length ? str.slice(cutIndex) : null;
    return { head, tail, width };
}

// 4-4. Image & Icon Rendering Helper Functions
//-----------------------------------------------------------------------------

/**
 * @summary Adds a list marker image (checkbox, bullet, number).
 * @param {WidgetStack} stack - The stack to add the image to.
 * @param {object} config - The style configuration for the marker.
 * @param {string} type - The type of list ('todo', 'bullet', 'number').
 * @param {string} listNumber - The number for the numbered list.
 */
function addListMarker(stack, config, type, listNumber) {
    switch (type) {
        case 'todo':
            const todoImage = SFSymbol.named('circle').image;
            //const todoImage = storeImage('square.png'); // Use this for a square checkbox
            addImage(stack, todoImage, config);
            break;
        case 'done':
            const doneImage = SFSymbol.named('checkmark.circle').image;
            addImage(stack, doneImage, config);
            break;
        case 'cancelled':
            const cancelledImage = SFSymbol.named('xmark.circle').image;
            addImage(stack, cancelledImage, config);
            break;
        case 'forwarded':
            const forwardedImage = SFSymbol.named('chevron.right.circle').image;
            addImage(stack, forwardedImage, config);
            break;
        case 'inprogress':
            const inprogressImage = SFSymbol.named('circle.righthalf.fill').image;
            addImage(stack, inprogressImage, config);
            break;
        case 'bullet':
            const bulletImage = storeImage('bullet-point.png');
            if (bulletImage) addImage(stack, bulletImage, config);
            break;
        case 'number':
            addNumberImage(stack, config, type, listNumber);
            break;
    }
}

/**
 * @summary Adds numbers or task counts as images.
 * @param {WidgetStack} stack - The stack to add the images to.
 * @param {object} config - The style configuration for the number images.
 * @param {string} type - The type ('number' or 'taskNum').
 * @param {string} numberStr - The string of numbers to display.
 */
function addNumberImage(stack, config, type, numberStr) {
    stack.addSpacer(2); // Space to align with other list types
    const numberImageStack = stack.addStack();
    numberImageStack.spacing = config.spacing;

    for (const char of numberStr.split('')) {
        const image = storeImage(`${char}.png`);
        if (image) addImage(numberImageStack, image, config);
    }
    
    // Add a dot at the end for numbered lists
    if (type === 'number') {
        const dotImage = storeImage('dot.png');
        if (dotImage) addImage(numberImageStack, dotImage, CONFIG.dotImage);
    }
}

/**
 * @summary Adds a reload icon.
 * @param {WidgetStack} stack - The stack to add the icon to.
 * @param {object} config - The style configuration for the icon.
 */
function addReloadIcon(stack, config) {
    const image = SFSymbol.named('arrow.clockwise').image;
    const imageElement = addImage(stack, image, config);
    imageElement.url = URLScheme.forRunningScript(); // Tap to re-run the script
}

/**
 * @summary A generic function to add an image to a stack with specified settings.
 * @param {WidgetStack} stack - The parent stack to add the image to.
 * @param {Image} image - The image object to add.
 * @param {object} config - The style configuration for the image.
 * @returns {WidgetImage} The added image element.
 */
function addImage(stack, image, config) {
    const { topPadding, bottomPadding, rightMargin, leftMargin, imageSizeScale, color_light, color_dark } = config;

    stack.addSpacer(leftMargin);
    const imageContainer = stack.addStack();
    imageContainer.layoutVertically();
    imageContainer.addSpacer(topPadding);

    const imageRatio = image.size.width / image.size.height;
    const imageHeight = FONT_SIZE * imageSizeScale;
    const imageWidth = imageHeight * imageRatio;
    const imageSize = new Size(imageWidth, imageHeight);

    const imageElement = imageContainer.addImage(image);
    imageElement.imageSize = imageSize;
    imageElement.tintColor = Color.dynamic(color_light, color_dark);

    imageContainer.addSpacer(bottomPadding);
    stack.addSpacer(rightMargin);
    return imageElement;
}


// 4-5. Utility Functions
//-----------------------------------------------------------------------------

/**
 * @summary Returns settings for displayable lines and width based on widget size.
 * @returns {object} Configuration values for each widget size.
 */
function getWidgetConfigByFamily() {
    // The following formulas are empirical approximations derived from the relationship between font size and the physical size of the widget.
    // Minor adjustments may be needed depending on the device or OS version.
    switch (config.widgetFamily) {
        case 'small':
            return {
                lineLimit_iPhone: () => Math.floor((127 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((95 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -3.066 * FONT_SIZE + 0.0644 * FONT_SIZE * FONT_SIZE + 49.423 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -4.411 * FONT_SIZE + 0.125  * FONT_SIZE * FONT_SIZE + 51.441,
                fullWidthCharSize: 1.85
            };
        case 'medium':
            return {
                lineLimit_iPhone: () => Math.floor((127 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((95 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -9.44  * FONT_SIZE + 0.2348 * FONT_SIZE * FONT_SIZE + 132.354 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -8.919 * FONT_SIZE + 0.223  * FONT_SIZE * FONT_SIZE + 120.832,
                fullWidthCharSize: 2
            };
        case 'large':
            return {
                lineLimit_iPhone: () => Math.floor((297 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((263 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -9.44  * FONT_SIZE + 0.2348 * FONT_SIZE * FONT_SIZE + 132.354 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -8.919 * FONT_SIZE + 0.223  * FONT_SIZE * FONT_SIZE + 120.832,
                fullWidthCharSize: 2
            };
        case 'extraLarge': // iPad only
            return {
                lineLimit_iPad:   () => Math.floor((263 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPad:   -16.264 * FONT_SIZE + 0.375 * FONT_SIZE * FONT_SIZE + 245.632,
                fullWidthCharSize: 2
            };
        default: // Use 'large' settings as default
            return {
                lineLimit_iPhone: () => Math.floor((297 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                lineLimit_iPad:   () => Math.floor((263 - (CONFIG.firstLineText.fontSizeScale + (CONFIG.h1.fontSizeScale - 1) * H1_COUNT + (CONFIG.h2.fontSizeScale - 1) * H2_COUNT + (CONFIG.h3.fontSizeScale - 1) * H3_COUNT) * FONT_SIZE + LINE_SPACING) / (FONT_SIZE + LINE_SPACING)),
                maxLineWidth_iPhone: -9.44  * FONT_SIZE + 0.2348 * FONT_SIZE * FONT_SIZE + 132.354 - MAX_LINE_WIDTH_OFFSET,
                maxLineWidth_iPad:   -8.919 * FONT_SIZE + 0.223  * FONT_SIZE * FONT_SIZE + 120.832,
                fullWidthCharSize: 2
            };
    }
}

/**
 * @summary Loads an image stored as a script asset.
 * @description Reads an image from the "Scriptable/Images/" directory in iCloud Drive.
 * @param {string} fileName - The name of the image file to load (e.g., '0.png').
 * @returns {Image|null} The loaded image object, or null if not found.
 */
function storeImage(fileName) {
    const directoryName = 'Images'; // The folder where images are stored
    const path = iCloud.joinPath(iCloud.joinPath(iCloud.documentsDirectory(), directoryName), fileName);
    
    if (iCloud.fileExists(path)) {
        return iCloud.readImage(path);
    } else {
        console.error(`Image file not found: ${path}`);
        return null;
    }
}