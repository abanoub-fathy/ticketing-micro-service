const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string, cb: () => void) => {
        console.log("calling mock function for publish");
        cb();
      }),
  },
};

export default natsWrapper;
