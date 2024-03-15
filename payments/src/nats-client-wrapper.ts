import nats, { Stan } from "node-nats-streaming";

class NatsClientWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error(
        "could not return nats client. the client is not connected to the server."
      );
    }

    return this._client!;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("connected to NATS ✅");
        return resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export default new NatsClientWrapper();
