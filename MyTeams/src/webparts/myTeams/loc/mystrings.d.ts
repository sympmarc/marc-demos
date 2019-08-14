declare interface IMyTeamsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  tenantSiteExclusionsContainsFieldLabel: string;
  tenantSiteExclusionsEqualsFieldLabel: string;
}

declare module 'MyTeamsWebPartStrings' {
  const strings: IMyTeamsWebPartStrings;
  export = strings;
}
