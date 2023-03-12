describe("serverFunctions", () => {
    test("addPlayerToRoomFromRequest", async () => {
        let req = {
            body: {
               roomCode: "testRoom",
               nickname: "testName" 
            }
        }
        let [status, data] = await sv.addPlayerToRoomFromRequest(req);
        expect(data).toHaveProperty("room");
        expect(data.room).toHaveProperty("roomCode");
        expect(data.room.roomCode).toBe("testRoom");
        expect(data).toHaveProperty("roomId");
        expect(data).toHaveProperty("player");
        expect(data.player).toHaveProperty("roomCode");
        expect(data.player.nickname).toBe("testName");
        expect(data).toHaveProperty("playerId");
        expect(data).toHaveProperty("message");
        expect(data.message).toBe("OK");
        expect(status).toBe(200);
    })
});