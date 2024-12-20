import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import {
  type ProjectsVerificationStatuses,
  notUndefined,
} from '@l2beat/shared-pure'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { type ProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'
import { type SevenDayTvlBreakdown } from './utils/get-7d-tvl-breakdown'

export function getScalingTvlEntries({
  projectsChangeReport,
  projectsVerificationStatuses,
  tvl,
}: {
  projectsChangeReport: ProjectsChangeReport
  projectsVerificationStatuses: ProjectsVerificationStatuses
  tvl: SevenDayTvlBreakdown
}) {
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )

  const entries = projects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const latestTvl = tvl.projects[project.id.toString()]

      return getScalingTvlEntry(
        project,
        isVerified,
        projectsChangeReport,
        latestTvl,
      )
    })
    .filter((entry) => entry.tvl.data)

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [
      k,
      v.breakdown.canonical + v.breakdown.native + v.breakdown.external,
    ]),
  )

  return groupByMainCategories(orderByStageAndTvl(entries, remappedForOrdering))
}

export type ScalingTvlEntry = Awaited<ReturnType<typeof getScalingTvlEntry>>
function getScalingTvlEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
  latestTvl: SevenDayTvlBreakdown['projects'][string] | undefined,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
    }),
    href: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    entryType: 'scaling' as const,
    tvl: {
      data: latestTvl && {
        breakdown: latestTvl.breakdown,
        change: latestTvl.change,
        totalChange: latestTvl.totalChange,
      },
      associatedTokens: project.config.associatedTokens ?? [],
      warnings: [project.display.tvlWarning].filter(notUndefined),
    },
  }
}
