import numeral from "numeral"

if (numeral.locales["uy"] === undefined) {
  numeral.register("locale", "uy", {
    delimiters: {
      thousands: ".",
      decimal: ",",
    },
    abbreviations: {
      thousand: "k",
      million: "m",
      billion: "mm",
      trillion: "b",
    },
    ordinal: (number: number) => {
      let b = number % 10
      return b === 1 || b === 3
        ? "er"
        : b === 2
          ? "do"
          : b === 7 || b === 0
            ? "mo"
            : b === 8
              ? "vo"
              : b === 9
                ? "no"
                : "to"
    },
    currency: {
      symbol: "$U",
    },
  })
}
numeral.locale("uy")

export { numeral }
