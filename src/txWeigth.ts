export enum TransactionSize {
  P2PKH_IN_SIZE = 148,
  P2PKH_OUT_SIZE = 34,

  P2SH_OUT_SIZE = 32,
  P2SH_P2WPKH_OUT_SIZE = 32,
  P2SH_P2WSH_OUT_SIZE = 32,

  P2SH_P2WPKH_IN_SIZE = 90.75,

  P2WPKH_IN_SIZE = 67.75,
  P2WPKH_OUT_SIZE = 31,

  P2WSH_OUT_SIZE = 43,
  P2TR_OUT_SIZE = 43,

  P2TR_IN_SIZE = 57.25,

  PUBKEY_SIZE = 33,
  SIGNATURE_SIZE = 72,
}

export function getSizeOfScriptLengthElement(length) {
  if (length < 75) {
    return 1;
  } else if (length <= 255) {
    return 2;
  } else if (length <= 65535) {
    return 3;
  } else if (length <= 4294967295) {
    return 5;
  } else {
    alert("Size of redeem script is too large");
  }
}

export function getSizeOfVarInt(length) {
  if (length < 253) {
    return 1;
  } else if (length < 65535) {
    return 3;
  } else if (length < 4294967295) {
    return 5;
  } else if (length < 18446744073709551615) {
    return 9;
  } else {
    alert("Invalid var int");
  }
}

export function getTxOverheadVBytes(input_script, input_count, output_count) {
  if (input_script == "P2PKH" || input_script == "P2SH") {
    var witness_vbytes = 0;
  } else {
    var witness_vbytes =
      0.25 + // segwit marker
      0.25 + // segwit flag
      input_count / 4; // witness element count per input
  }

  return (
    4 +
    getSizeOfVarInt(input_count) +
    getSizeOfVarInt(output_count) +
    4 +
    witness_vbytes
  );
}

export function getTxOverheadExtraRawBytes(input_script, input_count) {
  if (input_script == "P2PKH" || input_script == "P2SH") {
    var witness_bytes = 0;
  } else {
    var witness_bytes =
      0.25 + // segwit marker
      0.25 + // segwit flag
      input_count / 4; // witness element count per input
  }

  return witness_bytes * 3;
}
