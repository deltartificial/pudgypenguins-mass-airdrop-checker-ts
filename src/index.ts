import privateKeys from "./pk.json";
import { CheckerService } from "./services/checker.service";

const checker = new CheckerService();
checker.checkAllEligibility(privateKeys);
