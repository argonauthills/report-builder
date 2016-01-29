export interface Report {
    header: string;
    description: string;
    sections: ReportSection[];
}

export interface ReportSection {
    header: QuestionResult;
    questions: QuestionResult[];
}

export interface QuestionResult {
    question: string;
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
    questions: ReportConfigQuestion[];
}

export interface ReportConfigQuestion {
    id: string;
    scale: number;
}

export interface RawData {
    [key: string]: any;
}