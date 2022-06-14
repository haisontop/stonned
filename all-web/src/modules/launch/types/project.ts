import { Project, MintingPeriod, User, Pricing, ProjectRoadmapPeriod, ProjectTeamMember, ProjectUtility, ProjectRoadmapItem, PaymentOption, GalleryUrl } from '@prisma/client';
import { inferProcedureOutput } from '@trpc/server';
import { inferQueryOutput } from '../../../utils/trpc';

export type PaymentOptionWithPricing = PaymentOption & {
  pricings: Pricing[]
}

export type MintingPeriodWithPrices = MintingPeriod & {
  pricings: Pricing[]
}

export type MintingPeriodWithPricesAndPaymentOptions = MintingPeriod & {
  pricings: Pricing[]
  paymentOptions: PaymentOptionWithPricing[]
}

export type ProjectOverviewModel = Project & {
  mintingPeriods: MintingPeriodWithPrices[]
  creator?: User | null
  galleryUrls: GalleryUrl[]
}

type RoadmapPeriodWithItems = ProjectRoadmapPeriod & {
  roadmapItems: ProjectRoadmapItem[]
}

export type ProjectDetailModel = NonNullable<inferQueryOutput<'launch.getProject'>> /* Project & {
  mintingPeriods: MintingPeriodWithPricesAndPaymentOptions[]
  teamMembers: ProjectTeamMember[]
  utilities: ProjectUtility[]
  roadmapPeriods: RoadmapPeriodWithItems[]
  galleryUrls: GalleryUrl[]
} */