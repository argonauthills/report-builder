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