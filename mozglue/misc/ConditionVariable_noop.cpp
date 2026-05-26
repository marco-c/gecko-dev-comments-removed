



#include "mozilla/PlatformConditionVariable.h"
#include "mozilla/PlatformMutex.h"

using mozilla::TimeDuration;

mozilla::detail::ConditionVariableImpl::ConditionVariableImpl() {}

mozilla::detail::ConditionVariableImpl::~ConditionVariableImpl() {}

void mozilla::detail::ConditionVariableImpl::notify_one() {}

void mozilla::detail::ConditionVariableImpl::notify_all() {}

void mozilla::detail::ConditionVariableImpl::wait(MutexImpl&) {
  
  
}

mozilla::CVStatus mozilla::detail::ConditionVariableImpl::wait_for(
    MutexImpl&, const TimeDuration&) {
  return CVStatus::NoTimeout;
}
