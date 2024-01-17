import { alerts, setAlertsLogLevel } from "../../lib/core";

describe("alerts", () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation();
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });

  const TEST_ALERT_MSG = "TEST ALERT MESSAGE";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const EXPECTED = expect.stringContaining(TEST_ALERT_MSG);

  it("should print all messages with verbose log level", () => {
    setAlertsLogLevel("verbose");

    alerts.error(TEST_ALERT_MSG);

    expect(console.warn).toHaveBeenLastCalledWith(EXPECTED);
    //make sure each alert only calls console.log once
    expect(console.warn).toHaveBeenCalledTimes(1);

    alerts.warn(TEST_ALERT_MSG);

    expect(console.warn).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.warn).toHaveBeenCalledTimes(2);

    alerts.notice(TEST_ALERT_MSG);

    expect(console.log).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.log).toHaveBeenCalledTimes(1);

    alerts.info(TEST_ALERT_MSG);

    expect(console.log).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.log).toHaveBeenCalledTimes(2);

    alerts.success(TEST_ALERT_MSG);

    expect(console.log).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.log).toHaveBeenCalledTimes(3);
  });

  it("should only print error messages with error log level", () => {
    setAlertsLogLevel("error");

    alerts.error(TEST_ALERT_MSG);

    expect(console.warn).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.warn).toHaveBeenCalledTimes(1);

    alerts.warn(TEST_ALERT_MSG);
    alerts.notice(TEST_ALERT_MSG);
    alerts.info(TEST_ALERT_MSG);
    alerts.success(TEST_ALERT_MSG);

    //shouldn't change
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("should print all but warning messages with info log level", () => {
    setAlertsLogLevel("info");

    alerts.error(TEST_ALERT_MSG);

    expect(console.warn).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.warn).toHaveBeenCalledTimes(1);

    alerts.notice(TEST_ALERT_MSG);

    expect(console.log).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.log).toHaveBeenCalledTimes(1);

    alerts.info(TEST_ALERT_MSG);

    expect(console.log).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.log).toHaveBeenCalledTimes(2);

    alerts.success(TEST_ALERT_MSG);

    expect(console.log).toHaveBeenLastCalledWith(EXPECTED);
    expect(console.log).toHaveBeenCalledTimes(3);

    alerts.warn(TEST_ALERT_MSG);

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("should print no messages with silent log level", () => {
    setAlertsLogLevel("silent");

    alerts.error(TEST_ALERT_MSG);
    alerts.warn(TEST_ALERT_MSG);
    alerts.notice(TEST_ALERT_MSG);
    alerts.info(TEST_ALERT_MSG);
    alerts.success(TEST_ALERT_MSG);

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
