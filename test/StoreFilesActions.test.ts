import * as actions from '~/store/files/actions'

describe("actions.default.handler", () => {
    test("0", () => {
        let result: any = actions.default.handler()
        expect(result).toMatchSnapshot()
    })
})