export interface Report {
    numberPagesFrom: number;
    firstPageNumber: number;
    excludeTableOfContents: boolean;
    excludeCoverPage: boolean;
    projectName: string;
    mainUri: string;
    footerUri: string;
    title: string;
    companyName: string;
    industryName: string;
    sections: ReportSection[];
}

export interface ReportSection {
    header: string;
    description: string;
    subsections: ReportSubsection[]
}

export interface ReportSubsection {
    title: string;
    description: string;
    questions: ReportQuestion[];
    orgScore: number;
    industryNorm: number;
    globalNorm: number;
    excludeGlobalNorms: boolean;
    excludeIndustryNorms: boolean;
    excludeKey: boolean;
    excludeHeader: boolean;
    scale: number;
    scaleInterval: number;
    showAsPercent: number;
}

export interface ReportQuestion {
    description: string;
    orgScore: number;
    industryNorm: number;
    globalNorm: number;
}




export interface ReportConfig {
    numberPagesFrom: number;
    firstPageNumber: number;
    minDataPoints: number;
    excludeTableOfContents: boolean;
    excludeCoverPage: boolean;
    projectName: string;
    mainImage: string;
    footerImage: string;
    title: string;
    sections: ReportConfigSection[];
}

export interface ReportConfigSection {
    header: string;
    description: string;
    subsections: ReportConfigSubsection[];
}

export interface ReportConfigSubsection {
    header: string;
    description: string;
    questions: ReportConfigQuestion[];
    scale: number;
    scaleInterval: number;
    showAsPercent: number;
    excludeGlobalNorms?: boolean;
    excludeIndustryNorms?: boolean;
    excludeKey?: boolean;
    excludeHeader?: boolean;
}

export interface ReportConfigQuestion {
    description: string;
    id: string;
    includeNulls?: boolean;  // normally we ignore nulls; with this, we count them as zero
}

export interface RawDatum {
    [key: string]: any;
}
