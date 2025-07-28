









#ifndef P2P_DTLS_DTLS_UTILS_H_
#define P2P_DTLS_DTLS_UTILS_H_

#include <cstddef>
#include <cstdint>
#include <optional>
#include <vector>

#include "api/array_view.h"

namespace webrtc {

const size_t kDtlsRecordHeaderLen = 13;
const size_t kMaxDtlsPacketLen = 2048;

bool IsDtlsPacket(ArrayView<const uint8_t> payload);
bool IsDtlsClientHelloPacket(ArrayView<const uint8_t> payload);
bool IsDtlsHandshakePacket(ArrayView<const uint8_t> payload);

std::optional<std::vector<uint16_t>> GetDtlsHandshakeAcks(
    ArrayView<const uint8_t> dtls_packet);

uint32_t ComputeDtlsPacketHash(ArrayView<const uint8_t> dtls_packet);

}  



namespace cricket {
using ::webrtc::GetDtlsHandshakeAcks;
using ::webrtc::IsDtlsClientHelloPacket;
using ::webrtc::IsDtlsHandshakePacket;
using ::webrtc::IsDtlsPacket;
using ::webrtc::kDtlsRecordHeaderLen;
using ::webrtc::kMaxDtlsPacketLen;
}  

#endif  
