const natsWrapper = {
  client: {
    publish: (subject: string, data: string, cb: () => void) => {
      console.log("calling mock function for publish");
      cb();
    },
  },
};

export default natsWrapper;
