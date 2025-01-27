import type { ModuleImplementation, ModuleTypes } from "../../shapes/module-shapes";
import { SalesForceIntegrationProvider } from "./integration-provider";

export const entryPoints: { [type in ModuleTypes]?: ModuleImplementation } = {
	integrations: new SalesForceIntegrationProvider()
};
