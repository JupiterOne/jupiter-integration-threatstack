import {
  EntityFromIntegration,
  RelationshipFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { ThreatStackAgent } from "./ThreatStackClient";
import {
  AGENT_ENTITY_CLASS,
  AGENT_ENTITY_TYPE,
  PROVIDER_NAME,
  ThreatStackAccountEntity,
  ThreatStackAgentEntity,
} from "./types";
import getTime from "./util/getTime";
import { normalizeHostname } from "./util/normalizeHostname";

export function createAgentEntities(
  data: ThreatStackAgent[],
): ThreatStackAgentEntity[] {
  const agents = [];

  for (const item of data) {
    const ipAddresses = [];
    const publicIpAddress = item.ipAddresses
      ? item.ipAddresses.public
      : undefined;
    const privateIpAddress = item.ipAddresses
      ? item.ipAddresses.private
      : undefined;
    const macAddress = item.ipAddresses
      ? item.ipAddresses.link_local
      : undefined;
    if (item.ipAddresses) {
      ipAddresses.push(...item.ipAddresses.public, ...item.ipAddresses.private);
    }

    agents.push({
      _key: `${PROVIDER_NAME}:agent:${item.id}`,
      _class: AGENT_ENTITY_CLASS,
      _type: AGENT_ENTITY_TYPE,
      displayName: item.name || "threatstack-server-agent",
      id: item.id,
      instanceId: item.instanceId,
      status: item.status,
      active: item.status.toLowerCase() === "online",
      version: item.version,
      name: item.name,
      description: item.description,
      hostname: normalizeHostname(item.hostname),
      ipAddresses,
      publicIpAddress,
      privateIpAddress,
      macAddress,
      agentType: item.agentType,
      kernel: item.kernel,
      osVersion: item.osVersion,
      createdAt: getTime(item.createdAt),
      lastReportedAt: getTime(item.lastReportedAt),
      createdOn: getTime(item.createdAt),
      function: ["FIM", "activity-monitor", "vulnerability-scan"],
    });
  }

  return agents;
}

export function createAccountRelationships(
  account: ThreatStackAccountEntity,
  entities: EntityFromIntegration[],
  type: string,
) {
  const relationships = [];
  for (const entity of entities) {
    relationships.push(createAccountRelationship(account, entity, type));
  }
  return relationships;
}

export function createAccountRelationship(
  account: ThreatStackAccountEntity,
  entity: EntityFromIntegration,
  type: string,
): RelationshipFromIntegration {
  return {
    _class: "HAS",
    _fromEntityKey: account._key,
    _key: `${account._key}_has_${entity._key}`,
    _toEntityKey: entity._key,
    _type: type,
  };
}
