import type { Campaign, Experiment, Journey, Segment } from "../types/engagement"
import { adminService } from "./adminService"
import type { UserRole } from "../types/auth"

const campaigns: Campaign[] = []
const segments: Segment[] = [{ id: "all-customers", name: "All customers", rule: "authenticated customers", size: 0 }]
const journeys: Journey[] = []
const experiments: Experiment[] = []
const guard = (role: UserRole | undefined, reason: string) => adminService.require(role, "FEATURE_FLAG_UPDATE", reason)

export const marketingService = {
  getCampaigns: () => [...campaigns],
  createCampaign(role: UserRole | undefined, input: Pick<Campaign, "name" | "productIds" | "audience">, reason: string): Campaign { guard(role, reason); const campaign = { ...input, id: `campaign-${Date.now()}`, status: "DRAFT" as const, updatedAt: new Date().toISOString() }; campaigns.push(campaign); return campaign },
  launchCampaign(role: UserRole | undefined, id: string, reason: string): Campaign { guard(role, reason); const campaign = campaigns.find((item) => item.id === id); if (!campaign) throw new Error("Campaign not found"); campaign.status = "ACTIVE"; campaign.updatedAt = new Date().toISOString(); return campaign },
  getSegments: () => [...segments],
  createJourney(role: UserRole | undefined, input: Pick<Journey, "name" | "trigger" | "segmentId">, reason: string): Journey { guard(role, reason); const journey = { ...input, id: `journey-${Date.now()}`, status: "DRAFT" as const }; journeys.push(journey); return journey },
  activateJourney(role: UserRole | undefined, id: string, reason: string): Journey { guard(role, reason); const journey = journeys.find((item) => item.id === id); if (!journey) throw new Error("Journey not found"); journey.status = "ACTIVE"; return journey },
  getExperiments: () => [...experiments],
  createExperiment(role: UserRole | undefined, input: Omit<Experiment, "id" | "status">, reason: string): Experiment { guard(role, reason); const experiment = { ...input, id: `experiment-${Date.now()}`, status: "DRAFT" as const }; experiments.push(experiment); return experiment },
  activateExperiment(role: UserRole | undefined, id: string, reason: string): Experiment { guard(role, reason); const experiment = experiments.find((item) => item.id === id); if (!experiment) throw new Error("Experiment not found"); experiment.status = "ACTIVE"; return experiment },
}
