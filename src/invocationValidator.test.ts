import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import uuid from "uuid/v4";
import invocationValidator from "./invocationValidator";
import { ThreatStackIntegrationConfig } from "./types";

test("should throw error if configuration is not found", async () => {
  const accountId = uuid();
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `Threat Stack configuration not found (accountId=${accountId})`,
  );
});

test("should throw error if User Id is missing", async () => {
  const accountId = uuid();
  const config: Partial<ThreatStackIntegrationConfig> = {
    orgId: uuid(),
    orgName: "my-org",
    apiKey: uuid(),
  };

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
      config,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `Missing User ID in configuration (accountId=${accountId})`,
  );
});

test("should throw error if Org Id is missing", async () => {
  const accountId = uuid();
  const config: Partial<ThreatStackIntegrationConfig> = {
    orgName: "my-org",
    userId: uuid(),
    apiKey: uuid(),
  };

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
      config,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `Missing Organization ID in configuration (accountId=${accountId})`,
  );
});

test("should throw error if Org Name is missing", async () => {
  const accountId = uuid();
  const config: Partial<ThreatStackIntegrationConfig> = {
    orgId: uuid(),
    userId: uuid(),
    apiKey: uuid(),
  };

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
      config,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `Missing Organization Name in configuration (accountId=${accountId})`,
  );
});

test("should throw if api key is missing", async () => {
  const accountId = uuid();
  const config: Partial<ThreatStackIntegrationConfig> = {
    userId: uuid(),
    orgId: uuid(),
    orgName: "my-org",
  };

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
      config,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `Missing API Key in configuration (accountId=${accountId})`,
  );
});
