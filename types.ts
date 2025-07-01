import { Database } from "./types/database.types";

// For Scenario Page
export type ScenarioAction = Database['public']['Tables']['scenario_actions']['Row'];
export type AuditStep = Database['public']['Tables']['scenarios']['Row'] & {
    actions: ScenarioAction[];
};

// For Checklist Page
export type ChecklistCategory = 'COMMUNS' | 'PERSONNEL' | 'INSTALLATIONS' | 'LIGNES DE PRODUCTION' | 'UTILITÉS';
export type ChecklistItem = Database['public']['Tables']['checklist_items']['Row'];
