#pragma once

#include <chrono>
#include <cstring>
#include <iostream>
#include <linux/can.h>
#include <linux/can/raw.h>
#include <net/if.h>
#include <string>
#include <sys/ioctl.h>
#include <sys/time.h>
#include <unistd.h>
#include <mutex>
#include <functional>

class CanDriver {
public:
	CanDriver();
	~CanDriver();

	using OnOpenCallback = std::function<void()>;
	using OnFailCallback = std::function<void()>;

	/**
   * @brief Initializes the CAN interface settings and performs the initial open.
	 * 
   * @param name Interface name (e.g., "can0", "vcan0").
   * @param reconnect_interval_ms Time to wait between reconnection attempts.
   * @param on_open_cb Optional callback triggered every time the socket is successfully opened.
	 * 
   * @return true if the initial open succeeds, false otherwise.
	 * 
   * @note Even if this returns false, the driver will store the settings 
	 * and automatically attempt to reconnect during subsequent read() or write() calls.
   */
	bool open(const std::string& name, OnOpenCallback on_open_cb = nullptr, OnFailCallback on_fail_cb = nullptr, int reconnect_interval_ms = 1000);
	void close();

	/**
   * @brief Reads/Writes a CAN frame from/to the interface.
	 * 
   * Returns 'true' on success.
   * On failure (e.g., socket error, disconnection), returns 'false' and internally triggers an asynchronous reconnection attempt.
	 * 
   * It is assumed that the caller either calls these methods within a loop or handles the 'false' return value to decide whether to retry.
   * The driver manages the "path" (socket), while the user manages the "data" (retry logic or dropped frame handling).
   */
	bool read(can_frame& frame);
	bool write(const can_frame& frame);

	// bool isConnected() const { return sock_ >= 0; }

private:
	std::recursive_mutex mtx_;
	int sock_ = -1;

	std::string interface_name_;
	int reconnect_interval_ms_;
	std::chrono::steady_clock::time_point last_reconnect_attempt_;

	OnOpenCallback on_open_cb_;
	OnFailCallback on_fail_cb_;

	bool openSocket();
	void closeSocket();
	bool shouldRetryReconnect();
};