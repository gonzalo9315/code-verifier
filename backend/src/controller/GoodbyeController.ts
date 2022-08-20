import { GoodbyeResponse } from "./types"
import { IHelloController } from "./interfaces"
import { LogSuccess } from "../utils/logger"

export class GoodbyeController implements IHelloController {
    public async getMessage (name?: string): Promise<GoodbyeResponse> {
        LogSuccess('[api/goodbye] Get Request')
        const fecha = new Date()
        return {
            message: `Hello ${name || "World!"}`,
            Date: fecha.toLocaleDateString()
        }
    }
}
