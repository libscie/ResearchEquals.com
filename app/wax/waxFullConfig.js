import { emDash, ellipsis } from "prosemirror-inputrules"
import { debounce } from "lodash"
import { columnResizing, tableEditing } from "prosemirror-tables"
import {
  InlineAnnotationsService,
  AnnotationToolGroupService,
  ImageService,
  ImageToolGroupService,
  LinkService,
  ListsService,
  ListToolGroupService,
  TablesService,
  TableToolGroupService,
  BaseService,
  BaseToolGroupService,
  DisplayBlockLevelService,
  DisplayToolGroupService,
  TextBlockLevelService,
  TextToolGroupService,
  NoteService,
  NoteToolGroupService,
  TrackChangeService,
  CommentsService,
  CodeBlockService,
  CodeBlockToolGroupService,
  DisplayTextToolGroupService,
  MathService,
  FindAndReplaceService,
  EditingSuggestingService,
  TrackingAndEditingToolGroupService,
  FullScreenService,
  FullScreenToolGroupService,
  SpecialCharactersService,
  SpecialCharactersToolGroupService,
  HighlightService,
  TextHighlightToolGroupServices,
  EditorInfoToolGroupServices,
  BottomInfoService,
  TransformService,
  TransformToolGroupService,
  TrackOptionsToolGroupService,
  TrackCommentOptionsToolGroupService,
  CustomTagInlineToolGroupService,
  CustomTagBlockToolGroupService,
  CustomTagService,
} from "wax-prosemirror-services"

import { DefaultSchema } from "wax-prosemirror-utilities"

import { WaxSelectionPlugin } from "wax-prosemirror-plugins"

import invisibles, { space, hardBreak, paragraph } from "@guardian/prosemirror-invisibles"

// const updateTitle = title => {
//   console.log(title);
// };

const updateTitle = debounce((title) => {
  // console.log(title);
}, 3000)

const saveTags = (tags) => {
  // console.log(tags);
}

const updateTrackStatus = (status) => {
  // console.log('status', status);
}

const config = {
  MenuService: [
    {
      templateArea: "mainMenuToolBar",
      toolGroups: [
        "Base",
        {
          name: "Annotations",
          more: ["Superscript", "Subscript", "SmallCaps", "Underline", "StrikeThrough"],
        },
        "HighlightToolGroup",
        "TransformToolGroup",
        "CustomTagInline",
        "Notes",
        "Lists",
        "Images",
        "SpecialCharacters",
        "CodeBlock",
        "Tables",
        "TrackingAndEditing",
        "FullScreen",
      ],
    },
    {
      templateArea: "leftSideBar",
      toolGroups: ["DisplayText"],
    },
    {
      templateArea: "commentTrackToolBar",
      toolGroups: ["TrackCommentOptions"],
    },
    {
      templateArea: "BottomRightInfo",
      toolGroups: ["InfoToolGroup"],
    },
  ],

  // CommentsService: { readOnly: true },
  SchemaService: DefaultSchema,
  TitleService: { updateTitle },
  RulesService: [emDash, ellipsis],
  ShortCutsService: {},
  EnableTrackChangeService: { enabled: false, toggle: true, updateTrackStatus },
  AcceptTrackChangeService: {
    own: {
      accept: true,
    },
    others: {
      accept: true,
    },
  },
  RejectTrackChangeService: {
    own: {
      reject: true,
    },
    others: {
      reject: true,
    },
  },
  PmPlugins: [columnResizing(), tableEditing(), invisibles([hardBreak()]), WaxSelectionPlugin],
  CustomTagService: {
    tags: [
      { label: "custom-tag-label-1", tagType: "inline" },
      { label: "custom-tag-label-2", tagType: "inline" },
      { label: "custom-tag-label-3", tagType: "block" },
      { label: "label 2", tagType: "block" },
    ],
    // updateTags: saveTags,
  },

  services: [
    new CustomTagService(),
    new DisplayBlockLevelService(),
    new DisplayToolGroupService(),
    new TextBlockLevelService(),
    new TextToolGroupService(),
    new ListsService(),
    new LinkService(),
    new InlineAnnotationsService(),
    new TrackChangeService(),
    new CommentsService(),
    new ImageService(),
    new TablesService(),
    new BaseService(),
    new BaseToolGroupService(),
    new NoteService(),
    new TableToolGroupService(),
    new ImageToolGroupService(),
    new AnnotationToolGroupService(),
    new NoteToolGroupService(),
    new ListToolGroupService(),
    new CodeBlockService(),
    new CodeBlockToolGroupService(),
    new EditingSuggestingService(),
    new DisplayTextToolGroupService(),
    new MathService(),
    new FindAndReplaceService(),
    new TrackingAndEditingToolGroupService(),
    new FullScreenService(),
    new FullScreenToolGroupService(),
    new SpecialCharactersService(),
    new SpecialCharactersToolGroupService(),
    new HighlightService(),
    new TextHighlightToolGroupServices(),
    new EditorInfoToolGroupServices(),
    new BottomInfoService(),
    new TransformService(),
    new TransformToolGroupService(),
    new TrackOptionsToolGroupService(),
    new TrackCommentOptionsToolGroupService(),
    new CustomTagInlineToolGroupService(),
    new CustomTagBlockToolGroupService(),
  ],
}

export default config
