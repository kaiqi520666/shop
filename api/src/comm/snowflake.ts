class Snowflake {
  twepoch: bigint;
  datacenterIdBits: bigint;
  workerIdBits: bigint;
  sequenceBits: bigint;
  workerId: bigint;
  sequence: bigint;
  datacenterId: bigint;
  lastTimestamp: bigint;
  maxDatacenterId: bigint;
  maxWorkerId: bigint;
  maxSequence: bigint;
  workerIdShift: bigint;
  datacenterIdShift: bigint;
  timestampLeftShift: bigint;

  constructor(datacenterId = 1, workerId = 1, sequence = 0) {
    this.twepoch = BigInt(1577836800000); // 使用 BigInt() 构造函数
    this.datacenterIdBits = BigInt(5);
    this.workerIdBits = BigInt(5);
    this.sequenceBits = BigInt(12);

    this.maxDatacenterId = BigInt(-1) ^ (BigInt(-1) << this.datacenterIdBits);
    this.maxWorkerId = BigInt(-1) ^ (BigInt(-1) << this.workerIdBits);
    this.maxSequence = BigInt(-1) ^ (BigInt(-1) << this.sequenceBits);

    this.workerIdShift = this.sequenceBits;
    this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
    this.timestampLeftShift =
      this.sequenceBits + this.workerIdBits + this.datacenterIdBits;

    this.lastTimestamp = BigInt(-1);

    this.datacenterId = BigInt(datacenterId);
    this.workerId = BigInt(workerId);
    this.sequence = BigInt(sequence);
  }

  _timeGen() {
    return BigInt(Date.now());
  }

  _tilNextMillis(lastTimestamp: bigint) {
    let timestamp = this._timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this._timeGen();
    }
    return timestamp;
  }

  nextId() {
    let timestamp = this._timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate id');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + BigInt(1)) & this.maxSequence;
      if (this.sequence === BigInt(0)) {
        timestamp = this._tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = BigInt(0);
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp - this.twepoch) << this.timestampLeftShift) |
      (this.datacenterId << this.datacenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence;

    return id.toString();
  }
}
export function snowflake() {
  const snowflake = new Snowflake(1, 1);
  return snowflake.nextId();
}
