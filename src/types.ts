export interface Report {
    header: string;
    description: string;
    sections: ReportSection[];
}

export interface ReportSection {
    header: ReportQuestion;
    questions: ReportQuestion[];
}

export interface ReportQuestion {
    description: string;
    orgScore: number;
    industryNorm: number;
    globalNorm: number;
    scale: number;
}




export interface ReportConfig {
    header: string;
    description: string;
    sections: ReportConfigSection[];
}

export interface ReportConfigSection {
    header: string;
    questions: ReportConfigQuestion[];
}

export interface ReportConfigQuestion {
    description: string;
    id: string;
    scale: number;
    industryNorm: number;
    globalNorm: number;
}

export interface RawDatum {
    [key: string]: any;
}