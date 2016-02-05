export interface Report {
    sections: ReportSection[];
}

export interface ReportSection {
    header: string;
    description: string;
    subsections: ReportSubsection[]
}

export interface ReportSubsection {
    header: ReportQuestion;
    questions: ReportQuestion[];
    orgScore: number;
    industryNorm: number;
    globalNorm: number;
    scale: number;
}

export interface ReportQuestion {
    description: string;
    orgScore: number;
    industryNorm: number;
    globalNorm: number;
    scale: number;
}




export interface ReportConfig {
    sections: ReportConfigSection[];
}

export interface ReportConfigSection {
    header: string;
    description: string;
    subsections: ReportConfigSubsection[];
}

export interface ReportConfigSubsection {
    header: string;
    questions: ReportConfigQuestion[];
}

export interface ReportConfigQuestion {
    description: string;
    id: string;
    scale: number;
}

export interface RawDatum {
    [key: string]: any;
}
