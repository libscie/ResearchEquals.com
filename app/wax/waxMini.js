import { DefaultSchema } from "wax-prosemirror-utilities"
import {
  InlineAnnotationsService,
  AnnotationToolGroupService,
  ListsService,
  ListToolGroupService,
  BaseService,
  BaseToolGroupService,
  LinkService,
} from "wax-prosemirror-services"
import { WaxSelectionPlugin } from "wax-prosemirror-plugins"

const config = {
  MenuService: [
    {
      templateArea: "topBar",
      toolGroups: [
        "Base",
        {
          name: "Annotations",
          exclude: ["Code", "StrikeThrough", "Underline", "SmallCaps"],
        },
        "Lists",
      ],
    },
  ],

  RulesService: [],
  ShortCutsService: {},
  LinkService: {},
  SchemaService: DefaultSchema,
  PmPlugins: [WaxSelectionPlugin],

  services: [
    new InlineAnnotationsService(),
    new AnnotationToolGroupService(),
    new LinkService(),
    new ListToolGroupService(),
    new BaseService(),
    new ListsService(),
    new BaseToolGroupService(),
  ],
}

export default config
