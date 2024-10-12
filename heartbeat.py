import asyncio
import threading
from fastapi import FastAPI
from bleak import BleakClient, BleakScanner
from fastapi.middleware.cors import CORSMiddleware

address = "0C:8C:DC:1A:F9:98"
HEART_RATE_MEASUREMENT_UUID = "00002a37-0000-1000-8000-00805f9b34fb"

# Shared variable to store the latest heart rate value
latest_heart_rate = None

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Allow requests from your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Function to handle heart rate notifications
def heart_rate_handler(sender: int, data: bytearray):
    global latest_heart_rate
    flags = data[0]
    hr_value_format = flags & 0x01

    if hr_value_format == 0:
        # Heart rate is in 8-bit format
        latest_heart_rate = data[1]
    else:
        # Heart rate is in 16-bit format
        latest_heart_rate = int.from_bytes(data[1:3], byteorder="little")

    print(f"Heart Rate: {latest_heart_rate} bpm")


# Function to run BLE client and subscribe to heart rate notifications
async def run_ble_client():


    exit = False

    while exit == False:
        devices = await BleakScanner.discover()
        for d in devices:
            if "Suunto" in d.name:
                exit = True
                print("Discoverd Suunto Device")

    async with BleakClient(address, timeout=60) as client:
        print("Connected to device, starting heart rate notifications...")

        # Subscribe to heart rate notifications
        await client.start_notify(HEART_RATE_MEASUREMENT_UUID, heart_rate_handler)

        # Keep the BLE client running indefinitely
        while True:
            await asyncio.sleep(1)  # Keep it alive while subscribed to notifications


# Background task to keep BLE client running
def start_ble_client():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run_ble_client())

# Start the BLE client in a separate thread
ble_thread = threading.Thread(target=start_ble_client, daemon=True)
ble_thread.start()


# API endpoint to get the latest heart rate
@app.get("/heartrate")
async def get_heart_rate():
    global latest_heart_rate
    if latest_heart_rate is None:
        return {"error": "Heart rate data not available yet."}
    return {"heart_rate": latest_heart_rate}


if __name__ == "__main__":
    import uvicorn
    # Start FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
