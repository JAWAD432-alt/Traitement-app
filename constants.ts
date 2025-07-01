
import { AuditStep } from './types';

const EMPTY_ACTION_FIELDS = { statut: '', resp: '', datePrevue: '', commentaires: '' };

export const AUDIT_STEPS_DATA: AuditStep[] = [
  {
    id: 1,
    title: "Arrivée et Réunion d'Ouverture",
    actions: [
      { id: 's1-1', point: 'Accueil & Salle', action: "Personne dédiée à l'accueil, salle de réunion préparée (matériel, boissons).", ...EMPTY_ACTION_FIELDS },
      { id: 's1-2', point: 'Participants & Présentation', action: "S'assurer de la présence du management clé. Avoir une présentation concise de l'entreprise prête.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 2,
    title: "Visite de la Salle de Traitement d'Eau",
    actions: [
      { id: 's2-1', point: 'Présence & Propreté', action: "Responsable technique présent, zone impeccable.", ...EMPTY_ACTION_FIELDS },
      { id: 's2-2', point: 'Dossiers', action: "Préparer les enregistrements d'analyses, de maintenance et de traitement.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 3,
    title: "Zone Stockage Matières Premières & Consommables (MPC)",
    actions: [
      { id: 's3-1', point: 'Organisation', action: "Zone rangée, lots identifiés, FIFO visiblement appliqué.", ...EMPTY_ACTION_FIELDS },
      { id: 's3-2', point: 'Documents', action: "Avoir les bons de livraison et certificats d'analyse fournisseurs à disposition.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 4,
    title: "Évaluation des Fournisseurs et Processus d'Approbation",
    actions: [
      { id: 's4-1', point: 'Préparation', action: "Préparer la liste des fournisseurs approuvés, les critères de sélection et les dossiers d'évaluation (questionnaires, audits, performances).", ...EMPTY_ACTION_FIELDS },
      { id: 's4-2', point: 'Responsable', action: "Le responsable des achats/qualité doit pouvoir expliquer le processus.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 5,
    title: "Visite de la Souffleuse et Ligne de Production 1",
    actions: [
      { id: 's5-1', point: 'Opérateurs & Propreté', action: "Opérateurs briefés, ligne et machine propres.", ...EMPTY_ACTION_FIELDS },
      { id: 's5-2', point: 'Enregistrements', action: "Fiches de production, de contrôle qualité en ligne et de maintenance machine prêtes.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 6,
    title: "Visite de la Ligne de Production 2",
    actions: [
      { id: 's6-1', point: 'Actions identiques', action: "Propreté, disponibilité des opérateurs et des enregistrements.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 7,
    title: "Vérification du Système de Nettoyage et Assainissement (NEP/CIP)",
    actions: [
      { id: 's7-1', point: 'Procédures', action: "Assurer la disponibilité des procédures de nettoyage.", ...EMPTY_ACTION_FIELDS },
      { id: 's7-2', point: 'Enregistrements', action: "Préparer les enregistrements des cycles de nettoyage, les validations de nettoyage et les certificats des produits chimiques utilisés.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 8,
    title: "Visite de l'Atelier de Maintenance et Revue du Système",
    actions: [
      { id: 's8-1', point: 'Propreté & Ordre', action: "L'atelier doit être rangé (5S).", ...EMPTY_ACTION_FIELDS },
      { id: 's8-2', point: 'Maintenance Préventive', action: "Préparer le planning de maintenance préventive et les preuves de sa réalisation (GMAO).", ...EMPTY_ACTION_FIELDS },
      { id: 's8-3', point: 'Curatif', action: "Avoir à disposition les fiches d'intervention suite à des pannes.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 9,
    title: "Zone de Contrôle Qualité / Laboratoire",
    actions: [
      { id: 's9-1', point: 'Propreté et Ordre', action: "Laboratoire impeccable.", ...EMPTY_ACTION_FIELDS },
      { id: 's9-2', point: 'Équipements', action: "S'assurer que les équipements sont fonctionnels et rangés.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 10,
    title: "Revue du Programme de Gestion des Étalonnages",
    actions: [
      { id: 's10-1', point: 'Planification', action: "Préparer la liste maîtresse des équipements à étalonner et le planning.", ...EMPTY_ACTION_FIELDS },
      { id: 's10-2', point: 'Certificats', action: "Rassembler les certificats d'étalonnage en cours de validité.", ...EMPTY_ACTION_FIELDS },
      { id: 's10-3', point: 'Procédure', action: "Avoir la procédure décrivant que faire en cas de résultat non-conforme.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 11,
    title: "Vérification des Systèmes de Contrôle de l'Environnement",
    actions: [
        { id: 's11-1', point: 'Lutte Nuisibles & Poussière', action: "Avoir les plans et rapports du prestataire externe.", ...EMPTY_ACTION_FIELDS },
        { id: 's11-2', point: 'Contrôles', action: "Préparer les enregistrements des contrôles environnementaux (air, surfaces).", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 12,
    title: "Zone de Stockage Produits Finis",
    actions: [
        { id: 's12-1', point: 'Organisation & Identification', action: "Zone rangée, palettes identifiées, traçabilité assurée.", ...EMPTY_ACTION_FIELDS },
        { id: 's12-2', point: 'Zone Non-Conforme', action: "Vérifier que cette zone est clairement délimitée et gérée.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 13,
    title: "Revue du Processus de Maîtrise du Produit Non-Conforme",
    actions: [
        { id: 's13-1', point: 'Procédure & Enregistrements', action: "Avoir la procédure et le registre des non-conformités.", ...EMPTY_ACTION_FIELDS },
        { id: 's13-2', point: 'Exemples', action: "Être capable de présenter un cas concret : de la détection à la décision (rebus, reclassement, retouche) avec les preuves associées.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 14,
    title: "Visite des Vestiaires et Douches",
    actions: [
        { id: 's14-1', point: 'Hygiène & Équipements', action: "Propreté irréprochable, casiers en bon état, consommables disponibles.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 15,
    title: "Visite des SAS (Personnel et Matériel)",
    actions: [
        { id: 's15-1', point: 'Fonctionnement & Instructions', action: "S'assurer du bon fonctionnement des lave-mains/gel et que les instructions sont claires et respectées.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 16,
    title: "Visite de l'Infirmerie",
    actions: [
        { id: 's16-1', point: 'Contenu & Registre', action: "Vérifier que la trousse de secours est complète et à jour. Le registre des soins doit être disponible.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 17,
    title: "Revue de la Préparation aux Situations d'Urgence",
    actions: [
        { id: 's17-1', point: 'Affichage', action: "S'assurer que les plans d'évacuation sont visibles et à jour.", ...EMPTY_ACTION_FIELDS },
        { id: 's17-2', point: 'Équipements', action: "Vérifier les extincteurs (contrôle périodique).", ...EMPTY_ACTION_FIELDS },
        { id: 's17-3', point: 'Registres', action: "Préparer les preuves des derniers exercices d'évacuation.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 18,
    title: "Zone de Gestion des Déchets (Déchetterie)",
    actions: [
        { id: 's18-1', point: 'Tri & Propreté', action: "Conteneurs identifiés, zone propre.", ...EMPTY_ACTION_FIELDS },
        { id: 's18-2', point: 'Traçabilité', action: "Avoir les bordereaux de suivi des déchets pour prouver leur élimination conforme.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 19,
    title: "Revue des Compétences du Personnel et de la Formation",
    actions: [
        { id: 's19-1', point: 'Dossiers', action: "Préparer l'organigramme, les fiches de poste et la matrice de polyvalence.", ...EMPTY_ACTION_FIELDS },
        { id: 's19-2', point: 'Plan de formation', action: "Avoir le plan de formation de l'année et les preuves de réalisation (feuilles d'émargement, évaluations).", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 20,
    title: "Revue du Programme d'Audits Internes",
    actions: [
        { id: 's20-1', point: 'Planification & Rapports', action: "Préparer le planning des audits internes, ainsi que les rapports des audits déjà réalisés.", ...EMPTY_ACTION_FIELDS },
        { id: 's20-2', point: 'Suivi', action: "Démontrer le suivi des actions correctives issues de ces audits.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 21,
    title: "Revue du Processus de Traitement des Réclamations Clients",
    actions: [
        { id: 's21-1', point: 'Procédure & Registre', action: "Avoir la procédure et le registre des réclamations.", ...EMPTY_ACTION_FIELDS },
        { id: 's21-2', point: 'Analyse', action: "Être capable de présenter l'analyse des causes et les actions mises en place suite à une réclamation significative.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 22,
    title: "Revue de la dernière Revue de Direction",
    actions: [
        { id: 's22-1', point: 'Compte-rendu', action: "Préparer le compte-rendu de la dernière revue de direction.", ...EMPTY_ACTION_FIELDS },
        { id: 's22-2', point: "Plan d'action", action: "Démontrer que les décisions et actions qui en ont découlé ont été suivies.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 23,
    title: "Revue Documentaire Finale et Questions Spécifiques",
    actions: [
        { id: 's23-1', point: 'Disponibilité', action: "Anticiper les documents clés (manuel qualité, procédures) et s'assurer que les responsables de processus sont joignables pour toute question.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 24,
    title: "Préparation de la Synthèse par l'Auditrice",
    actions: [
        { id: 's24-1', point: 'Mise à disposition', action: "Proposer un espace calme pour la préparation de la conclusion.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 25,
    title: "Réunion de Clôture",
    actions: [
        { id: 's25-1', point: 'Participants & Attitude', action: "Convoquer le management, écouter activement les constats, prendre des notes précises et poser des questions de clarification.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
  {
    id: 26,
    title: "Départ de l'Auditrice",
    actions: [
        { id: 's26-1', point: 'Accompagnement et Remerciements', action: "Raccompagner et remercier pour la visite et les pistes d'amélioration.", ...EMPTY_ACTION_FIELDS }
    ],
    completed: false,
  },
];
