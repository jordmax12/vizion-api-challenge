const mockSendSQSMessage = jest.fn(async () => true);

const { sendMessage } = require("../../logic/sqs");

const mockQueueUrl = "https://unit.test/queue";
const mockMessageBody = "This is a SQS message body.";
const mockMessageAttributes = {
  id: {
    DataType: "Number",
    StringValue: "1",
  },
  url: {
    DataType: "String",
    StringValue: mockQueueUrl,
  },
  created_at: {
    DataType: "String",
    StringValue: "2022-01-01T00:00:00Z",
  },
};

jest.mock("aws-sdk", () => ({
  SQS: jest.fn(() => ({
    sendMessage: mockSendSQSMessage,
  })),
}));

beforeAll(() => {
  jest.clearAllMocks();
});

describe("testing sqs logic file", () => {
  test("sendMessage", async () => {
    mockSendSQSMessage.mockReturnValueOnce({
      promise: async () => true,
    });

    await sendMessage(mockQueueUrl, mockMessageAttributes, mockMessageBody);
    expect(mockSendSQSMessage.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        MessageAttributes: mockMessageAttributes,
        MessageBody: mockMessageBody,
        QueueUrl: mockQueueUrl,
      })
    );
  });
});
