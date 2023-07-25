/**
 * The cursed collection
 */

// @ts-ignore
BigInt.prototype.toJSON = function() { return parseInt(this) }
