import { describe, expect, it } from "vitest";
import {
  DASHBOARD_STATES,
  DASHBOARD_STATE_INDICATOR_KEY,
  PRIMARY_ROUTE_NODE_KEYS,
  REVIEW_ACTION_EFFECTS,
  ROUTE_VIEW_CONTRACTS,
  assertFixturesDoNotReferenceReservedPaths,
  getFixtureSummary,
  getTenderOverviewModel,
  getTramFixtures
} from "./fixtures";

const fixtureCoverageTargets = {
  documents: 10,
  sourceReferences: 30,
  indicators: 40,
  reviewItems: 10,
  clarificationThreads: 5,
  contradictions: 5,
  timelineEvents: 5,
  deliverables: 6,
  requirements: 6,
  financialItems: 5,
  costDrivers: 5,
  auditEvents: 6
};

describe("fixture TRAM MVP", () => {
  it("carica solo fixture sintetiche", () => {
    const summary = getFixtureSummary();

    expect(summary.containsRealTenderData).toBe(false);
    expect(summary.tendersCount).toBeGreaterThanOrEqual(4);
    expect(summary.documentsCount).toBeGreaterThan(0);
    expect(summary.reviewItemsCount).toBeGreaterThan(0);
    expect(summary.clarificationImportsCount).toBeGreaterThan(0);
    expect(summary.clarificationThreadsCount).toBeGreaterThan(0);
    expect(summary.timelineEventsCount).toBeGreaterThan(0);
    expect(summary.deliverablesCount).toBeGreaterThan(0);
    expect(summary.routeNetworksCount).toBeGreaterThanOrEqual(4);
  });

  it("raggiunge le soglie di chiusura Fase 2", () => {
    const fixtures = getTramFixtures();

    expect(fixtures.documents.length).toBeGreaterThanOrEqual(fixtureCoverageTargets.documents);
    expect(fixtures.source_references.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.sourceReferences
    );
    expect(fixtures.indicators.length).toBeGreaterThanOrEqual(fixtureCoverageTargets.indicators);
    expect(fixtures.review_items.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.reviewItems
    );
    expect(fixtures.clarification_threads.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.clarificationThreads
    );
    expect(fixtures.contradictions.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.contradictions
    );
    expect(fixtures.timeline_events.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.timelineEvents
    );
    expect(fixtures.deliverables.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.deliverables
    );
    expect(fixtures.requirements.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.requirements
    );
    expect(fixtures.financial_items.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.financialItems
    );
    expect(fixtures.cost_drivers.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.costDrivers
    );
    expect(fixtures.audit_events.length).toBeGreaterThanOrEqual(
      fixtureCoverageTargets.auditEvents
    );
  });

  it("copre tutti gli stati dashboard MVP", () => {
    const fixtures = getTramFixtures();
    const tenderStates = new Set(fixtures.tenders.map((tender) => tender.dashboard_state));
    const routeStates = new Set(fixtures.route_networks.map((network) => network.overall_state));

    for (const state of DASHBOARD_STATES) {
      expect(tenderStates.has(state)).toBe(true);
      expect(routeStates.has(state)).toBe(true);
    }
  });

  it("rende calcolabile lo stato dashboard da indicatori e route network", () => {
    const fixtures = getTramFixtures();

    for (const tender of fixtures.tenders) {
      const stateIndicator = fixtures.indicators.find(
        (indicator) =>
          indicator.tender_id === tender.id && indicator.key === DASHBOARD_STATE_INDICATOR_KEY
      );
      const routeNetwork = fixtures.route_networks.find((network) => network.tender_id === tender.id);

      expect(stateIndicator?.value).toBe(tender.dashboard_state);
      expect(routeNetwork?.overall_state).toBe(tender.dashboard_state);

      if (tender.dashboard_state === "open_critical_issues") {
        const blockingReview = fixtures.review_items.some(
          (item) =>
            item.tender_id === tender.id &&
            ["blocked", "needs_owner", "open"].includes(item.status) &&
            ["high", "critical"].includes(item.risk)
        );

        expect(blockingReview).toBe(true);
      }
    }
  });

  it("mappa route, shape e indicatori del data contract Fase 3", () => {
    const fixtures = getTramFixtures();
    const fixtureIndicatorKeys = new Set(fixtures.indicators.map((indicator) => indicator.key));
    const contractIndicatorKeys = new Set<string>(
      ROUTE_VIEW_CONTRACTS.flatMap((contract) => [...contract.indicatorKeys])
    );

    expect(ROUTE_VIEW_CONTRACTS.map((contract) => contract.route)).toEqual([
      "/tenders",
      "/tenders/:tender_id/overview",
      "/tenders/:tender_id/documents",
      "/tenders/:tender_id/timeline",
      "/tenders/:tender_id/deliverables",
      "/tenders/:tender_id/requirements",
      "/tenders/:tender_id/financials",
      "/tenders/:tender_id/cost-drivers",
      "/tenders/:tender_id/contradictions",
      "/tenders/:tender_id/queries",
      "/tenders/:tender_id/review",
      "/tenders/:tender_id/audit"
    ]);

    for (const contract of ROUTE_VIEW_CONTRACTS) {
      expect(contract.primaryShape.length).toBeGreaterThan(0);
      expect(contract.secondaryShapes.length).toBeGreaterThan(0);

      for (const indicatorKey of contract.indicatorKeys) {
        expect(fixtureIndicatorKeys.has(indicatorKey)).toBe(true);
      }
    }

    for (const indicatorKey of fixtureIndicatorKeys) {
      expect(contractIndicatorKeys.has(indicatorKey)).toBe(true);
    }
  });

  it("definisce effetti tracciabili per le azioni review MVP", () => {
    expect(REVIEW_ACTION_EFFECTS.map((effect) => effect.action)).toEqual([
      "confirm",
      "correct",
      "contest",
      "mark_unclear",
      "mark_superseded",
      "mark_not_applicable",
      "request_more_evidence",
      "regenerate",
      "create_clarification_thread",
      "approve_for_export",
      "dismiss"
    ]);

    for (const effect of REVIEW_ACTION_EFFECTS) {
      expect(effect.targetStatus.length).toBeGreaterThan(0);
      expect(typeof effect.requiresSource).toBe("boolean");
    }
  });

  it("non contiene riferimenti a path riservati", () => {
    expect(() => assertFixturesDoNotReferenceReservedPaths()).not.toThrow();
  });

  it("copre i quattro archetipi MVP", () => {
    const fixtures = getTramFixtures();
    const ids = fixtures.tenders.map((tender) => tender.id);

    expect(ids).toContain("tender_fx_cop_metro_om");
    expect(ids).toContain("tender_fx_luas_light_rail_om");
    expect(ids).toContain("tender_fx_milano_bus_lots");
    expect(ids).toContain("tender_fx_metrolink_ppp_pq");
  });

  it("modella i registri Q&A come fonte tender sintetica", () => {
    const fixtures = getTramFixtures();
    const register = fixtures.clarification_register_imports.find(
      (item) => item.tender_id === "tender_fx_cop_metro_om"
    );
    const registerColumns = register ? Object.values(register.column_map) : [];

    expect(register).toBeDefined();
    expect(registerColumns).toEqual([
      "No.",
      "Subject",
      "Document reference",
      "Question",
      "Answer",
      "Clarification/Correction"
    ]);
    expect(register?.clarification_count).toBeGreaterThan(0);
    expect(register?.correction_count).toBeGreaterThan(0);
    expect(register?.missing_attachment_count).toBe(1);
  });

  it("rappresenta stato documenti e allegati mancanti da Q&A senza dati reali", () => {
    const fixtures = getTramFixtures();
    const threads = fixtures.clarification_threads.filter(
      (thread) => thread.tender_id === "tender_fx_cop_metro_om"
    );

    expect(
      threads.some((thread) => ["corrects", "supersedes"].includes(thread.currentness_effect))
    ).toBe(true);
    expect(threads.some((thread) => thread.blocked_reason?.includes("Allegato"))).toBe(true);
    expect(threads.every((thread) => thread.authority_platform_reference !== "automatic_send")).toBe(
      true
    );
  });

  it("modella la route network senza trattare Financials come protetto per categoria", () => {
    const fixtures = getTramFixtures();

    expect(fixtures.route_networks).toHaveLength(fixtures.tenders.length);

    for (const tender of fixtures.tenders) {
      const network = fixtures.route_networks.find((item) => item.tender_id === tender.id);
      const financialNode = network?.nodes.find((node) => node.node_key === "financials");

      expect(network).toBeDefined();
      expect(network?.nodes.map((node) => node.node_key)).toEqual([...PRIMARY_ROUTE_NODE_KEYS]);
      expect(financialNode).toBeDefined();
      expect(financialNode?.route_token).toBe("route-financials");
      expect(financialNode?.state).not.toBe("blocked_by_category");
    }

    expect(fixtures.financial_items.every((item) => item.privacy_level === "L1")).toBe(true);
    expect(
      fixtures.ai_gate_decisions.some((gate) => gate.decision === "blocked_l2_effective")
    ).toBe(true);
  });

  it("mantiene la route strip collegata a route, fonti e review esistenti", () => {
    const fixtures = getTramFixtures();
    const tenderIds = new Set(fixtures.tenders.map((tender) => tender.id));
    const sourceReferenceIds = new Set(fixtures.source_references.map((source) => source.id));
    const reviewItemIds = new Set(fixtures.review_items.map((item) => item.id));

    for (const network of fixtures.route_networks) {
      expect(tenderIds.has(network.tender_id)).toBe(true);

      const nodeKeys = new Set(network.nodes.map((node) => node.node_key));

      expect([...nodeKeys]).not.toContain("review");
      expect([...nodeKeys]).not.toContain("audit");

      for (const node of network.nodes) {
        expect(node.tender_id).toBe(network.tender_id);
        expect(node.target_route.startsWith(`/tenders/${network.tender_id}/`)).toBe(true);

        for (const sourceReferenceId of node.source_reference_ids) {
          expect(sourceReferenceIds.has(sourceReferenceId)).toBe(true);
        }

        for (const reviewItemId of node.review_item_ids) {
          expect(reviewItemIds.has(reviewItemId)).toBe(true);
        }
      }

      for (const edge of network.edges) {
        expect(edge.tender_id).toBe(network.tender_id);
        expect(nodeKeys.has(edge.from_node_key)).toBe(true);
        expect(nodeKeys.has(edge.to_node_key)).toBe(true);

        for (const sourceReferenceId of edge.source_reference_ids) {
          expect(sourceReferenceIds.has(sourceReferenceId)).toBe(true);
        }

        for (const reviewItemId of edge.review_item_ids) {
          expect(reviewItemIds.has(reviewItemId)).toBe(true);
        }
      }
    }
  });

  it("mantiene referenze fixture interne risolte", () => {
    const fixtures = getTramFixtures();
    const tenderIds = new Set(fixtures.tenders.map((tender) => tender.id));
    const documentIds = new Set(fixtures.documents.map((document) => document.id));
    const sourceReferenceIds = new Set(fixtures.source_references.map((source) => source.id));
    const aiGateIds = new Set(fixtures.ai_gate_decisions.map((gate) => gate.id));
    const reviewItemIds = new Set(fixtures.review_items.map((reviewItem) => reviewItem.id));
    const relatedRecordIds = new Set([...tenderIds, ...aiGateIds, ...reviewItemIds]);

    for (const document of fixtures.documents) {
      expect(tenderIds.has(document.tender_id)).toBe(true);
    }

    for (const sourceReference of fixtures.source_references) {
      expect(documentIds.has(sourceReference.document_id)).toBe(true);
    }

    for (const indicator of fixtures.indicators) {
      expect(tenderIds.has(indicator.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(indicator.source_reference_id)).toBe(true);
    }

    for (const reviewItem of fixtures.review_items) {
      expect(tenderIds.has(reviewItem.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(reviewItem.source_reference_id)).toBe(true);
    }

    for (const event of fixtures.timeline_events) {
      expect(tenderIds.has(event.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(event.source_reference_id)).toBe(true);
    }

    for (const deliverable of fixtures.deliverables) {
      expect(tenderIds.has(deliverable.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(deliverable.source_reference_id)).toBe(true);
    }

    for (const requirement of fixtures.requirements) {
      expect(tenderIds.has(requirement.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(requirement.source_reference_id)).toBe(true);
    }

    for (const financialItem of fixtures.financial_items) {
      expect(tenderIds.has(financialItem.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(financialItem.source_reference_id)).toBe(true);
    }

    for (const costDriver of fixtures.cost_drivers) {
      expect(tenderIds.has(costDriver.tender_id)).toBe(true);
      expect(sourceReferenceIds.has(costDriver.source_reference_id)).toBe(true);
    }

    for (const contradiction of fixtures.contradictions) {
      expect(tenderIds.has(contradiction.tender_id)).toBe(true);

      for (const sourceReferenceId of contradiction.source_reference_ids) {
        expect(sourceReferenceIds.has(sourceReferenceId)).toBe(true);
      }
    }

    for (const aiGateDecision of fixtures.ai_gate_decisions) {
      expect(tenderIds.has(aiGateDecision.tender_id)).toBe(true);
      expect(aiGateDecision.estimated_cost ?? 0).toBe(0);
    }

    for (const auditEvent of fixtures.audit_events) {
      expect(tenderIds.has(auditEvent.tender_id)).toBe(true);

      if (auditEvent.related_record_id) {
        expect(relatedRecordIds.has(auditEvent.related_record_id)).toBe(true);
      }
    }
  });

  it("espone readiness pilot senza dichiarare completato il pilot reale", () => {
    const model = getTenderOverviewModel("tender_fx_cop_metro_om");

    expect(model.pilotReadiness.status).toBe("ready_for_internal_pilot");
    expect(model.pilotReadiness.completedUserCount).toBe(0);
    expect(model.pilotReadiness.userCountTarget).toBe(3);
    expect(model.pilotReadiness.blockers).toContain(
      "Pilot reale con utenti interni non ancora completato."
    );
    expect(model.pilotReadiness.metrics.taskCoverage.T1).toBeGreaterThan(0);
    expect(model.pilotReadiness.metrics.taskCoverage.T8).toBeGreaterThan(0);
  });
});
