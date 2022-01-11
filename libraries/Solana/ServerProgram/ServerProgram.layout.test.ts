import * as ServerProgram_layout from "~/libraries/Solana/ServerProgram/ServerProgram.layout"
import { expect } from '@jest/globals'

describe.skip("ServerProgram_layout.encodeInstructionData", () => { // AP-328
    test("0", () => {
        let result: any = ServerProgram_layout.encodeInstructionData({ createDerivedAccount: { key1: 100, key0: -100 } })
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result: any = ServerProgram_layout.encodeInstructionData({ createDerivedAccount: { key1: -5.48, key0: 0 } })
        expect(result).toMatchSnapshot()
    })

    test("2", () => {
        let result: any = ServerProgram_layout.encodeInstructionData({ createDerivedAccount: { key1: 0, key0: 1 } })
        expect(result).toMatchSnapshot()
    })

    test("3", () => {
        let result: any = ServerProgram_layout.encodeInstructionData({ createDerivedAccount: { key1: 1, key0: 0 } })
        expect(result).toMatchSnapshot()
    })

    test("4", () => {
        let result: any = ServerProgram_layout.encodeInstructionData({ createDerivedAccount: { key0: 1 } })
        expect(result).toMatchSnapshot()
    })

    test("5", () => {
        let result: any = ServerProgram_layout.encodeInstructionData({ createDerivedAccount: { key1: -Infinity, key0: -Infinity } })
        expect(result).toMatchSnapshot()
    })
})