


#include "unicode/utypes.h"

#if !UCONFIG_NO_FORMATTING && !UPRV_INCOMPLETE_CPP11_SUPPORT

#include "cstring.h"
#include "number_patternmodifier.h"
#include "unicode/dcfmtsym.h"
#include "unicode/ucurr.h"
#include "unicode/unistr.h"

using namespace icu;
using namespace icu::number;
using namespace icu::number::impl;

MutablePatternModifier::MutablePatternModifier(bool isStrong) : fStrong(isStrong) {}

void MutablePatternModifier::setPatternInfo(const AffixPatternProvider *patternInfo) {
    this->patternInfo = patternInfo;
}

void MutablePatternModifier::setPatternAttributes(UNumberSignDisplay signDisplay, bool perMille) {
    this->signDisplay = signDisplay;
    this->perMilleReplacesPercent = perMille;
}

void
MutablePatternModifier::setSymbols(const DecimalFormatSymbols *symbols, const CurrencyUnit &currency,
                                   const UNumberUnitWidth unitWidth, const PluralRules *rules) {
    U_ASSERT((rules != nullptr) == needsPlurals());
    this->symbols = symbols;
    uprv_memcpy(static_cast<char16_t *>(this->currencyCode),
            currency.getISOCurrency(),
            sizeof(char16_t) * 4);
    this->unitWidth = unitWidth;
    this->rules = rules;
}

void MutablePatternModifier::setNumberProperties(int8_t signum, StandardPlural::Form plural) {
    this->signum = signum;
    this->plural = plural;
}

bool MutablePatternModifier::needsPlurals() const {
    UErrorCode statusLocal = U_ZERO_ERROR;
    return patternInfo->containsSymbolType(AffixPatternType::TYPE_CURRENCY_TRIPLE, statusLocal);
    
}

ImmutablePatternModifier *MutablePatternModifier::createImmutable(UErrorCode &status) {
    return createImmutableAndChain(nullptr, status);
}

ImmutablePatternModifier *
MutablePatternModifier::createImmutableAndChain(const MicroPropsGenerator *parent, UErrorCode &status) {

    
    static const StandardPlural::Form STANDARD_PLURAL_VALUES[] = {
            StandardPlural::Form::ZERO,
            StandardPlural::Form::ONE,
            StandardPlural::Form::TWO,
            StandardPlural::Form::FEW,
            StandardPlural::Form::MANY,
            StandardPlural::Form::OTHER};

    auto pm = new ParameterizedModifier();
    if (pm == nullptr) {
        status = U_MEMORY_ALLOCATION_ERROR;
        return nullptr;
    }

    if (needsPlurals()) {
        
        for (StandardPlural::Form plural : STANDARD_PLURAL_VALUES) {
            setNumberProperties(1, plural);
            pm->adoptSignPluralModifier(1, plural, createConstantModifier(status));
            setNumberProperties(0, plural);
            pm->adoptSignPluralModifier(0, plural, createConstantModifier(status));
            setNumberProperties(-1, plural);
            pm->adoptSignPluralModifier(-1, plural, createConstantModifier(status));
        }
        if (U_FAILURE(status)) {
            delete pm;
            return nullptr;
        }
        return new ImmutablePatternModifier(pm, rules, parent);  
    } else {
        
        setNumberProperties(1, StandardPlural::Form::COUNT);
        Modifier *positive = createConstantModifier(status);
        setNumberProperties(0, StandardPlural::Form::COUNT);
        Modifier *zero = createConstantModifier(status);
        setNumberProperties(-1, StandardPlural::Form::COUNT);
        Modifier *negative = createConstantModifier(status);
        pm->adoptPositiveNegativeModifiers(positive, zero, negative);
        if (U_FAILURE(status)) {
            delete pm;
            return nullptr;
        }
        return new ImmutablePatternModifier(pm, nullptr, parent);  
    }
}

ConstantMultiFieldModifier *MutablePatternModifier::createConstantModifier(UErrorCode &status) {
    NumberStringBuilder a;
    NumberStringBuilder b;
    insertPrefix(a, 0, status);
    insertSuffix(b, 0, status);
    if (patternInfo->hasCurrencySign()) {
        return new CurrencySpacingEnabledModifier(a, b, !patternInfo->hasBody(), fStrong, *symbols, status);
    } else {
        return new ConstantMultiFieldModifier(a, b, !patternInfo->hasBody(), fStrong);
    }
}

ImmutablePatternModifier::ImmutablePatternModifier(ParameterizedModifier *pm, const PluralRules *rules,
                                                   const MicroPropsGenerator *parent)
        : pm(pm), rules(rules), parent(parent) {}

void ImmutablePatternModifier::processQuantity(DecimalQuantity &quantity, MicroProps &micros,
                                               UErrorCode &status) const {
    parent->processQuantity(quantity, micros, status);
    applyToMicros(micros, quantity);
}

void ImmutablePatternModifier::applyToMicros(MicroProps &micros, DecimalQuantity &quantity) const {
    if (rules == nullptr) {
        micros.modMiddle = pm->getModifier(quantity.signum());
    } else {
        
        DecimalQuantity copy(quantity);
        copy.roundToInfinity();
        StandardPlural::Form plural = copy.getStandardPlural(rules);
        micros.modMiddle = pm->getModifier(quantity.signum(), plural);
    }
}


MicroPropsGenerator &MutablePatternModifier::addToChain(const MicroPropsGenerator *parent) {
    this->parent = parent;
    return *this;
}

void MutablePatternModifier::processQuantity(DecimalQuantity &fq, MicroProps &micros,
                                             UErrorCode &status) const {
    parent->processQuantity(fq, micros, status);
    
    
    auto nonConstThis = const_cast<MutablePatternModifier *>(this);
    if (needsPlurals()) {
        
        DecimalQuantity copy(fq);
        micros.rounding.apply(copy, status);
        nonConstThis->setNumberProperties(fq.signum(), copy.getStandardPlural(rules));
    } else {
        nonConstThis->setNumberProperties(fq.signum(), StandardPlural::Form::COUNT);
    }
    micros.modMiddle = this;
}

int32_t MutablePatternModifier::apply(NumberStringBuilder &output, int32_t leftIndex, int32_t rightIndex,
                                      UErrorCode &status) const {
    
    
    auto nonConstThis = const_cast<MutablePatternModifier *>(this);
    int32_t prefixLen = nonConstThis->insertPrefix(output, leftIndex, status);
    int32_t suffixLen = nonConstThis->insertSuffix(output, rightIndex + prefixLen, status);
    
    int32_t overwriteLen = 0;
    if (!patternInfo->hasBody()) {
        overwriteLen = output.splice(
            leftIndex + prefixLen, rightIndex + prefixLen,
            UnicodeString(), 0, 0, UNUM_FIELD_COUNT,
            status);
    }
    CurrencySpacingEnabledModifier::applyCurrencySpacing(
            output,
            leftIndex,
            prefixLen,
            rightIndex + overwriteLen + prefixLen,
            suffixLen,
            *symbols,
            status);
    return prefixLen + overwriteLen + suffixLen;
}

int32_t MutablePatternModifier::getPrefixLength(UErrorCode &status) const {
    
    
    auto nonConstThis = const_cast<MutablePatternModifier *>(this);

    
    nonConstThis->enterCharSequenceMode(true);
    int result = AffixUtils::unescapedCodePointCount(*this, *this, status);  
    nonConstThis->exitCharSequenceMode();
    return result;
}

int32_t MutablePatternModifier::getCodePointCount(UErrorCode &status) const {
    
    
    auto nonConstThis = const_cast<MutablePatternModifier *>(this);

    
    nonConstThis->enterCharSequenceMode(true);
    int result = AffixUtils::unescapedCodePointCount(*this, *this, status);  
    nonConstThis->exitCharSequenceMode();
    nonConstThis->enterCharSequenceMode(false);
    result += AffixUtils::unescapedCodePointCount(*this, *this, status);  
    nonConstThis->exitCharSequenceMode();
    return result;
}

bool MutablePatternModifier::isStrong() const {
    return fStrong;
}

int32_t MutablePatternModifier::insertPrefix(NumberStringBuilder &sb, int position, UErrorCode &status) {
    enterCharSequenceMode(true);
    int length = AffixUtils::unescape(*this, sb, position, *this, status);
    exitCharSequenceMode();
    return length;
}

int32_t MutablePatternModifier::insertSuffix(NumberStringBuilder &sb, int position, UErrorCode &status) {
    enterCharSequenceMode(false);
    int length = AffixUtils::unescape(*this, sb, position, *this, status);
    exitCharSequenceMode();
    return length;
}

UnicodeString MutablePatternModifier::getSymbol(AffixPatternType type) const {
    switch (type) {
        case AffixPatternType::TYPE_MINUS_SIGN:
            return symbols->getSymbol(DecimalFormatSymbols::ENumberFormatSymbol::kMinusSignSymbol);
        case AffixPatternType::TYPE_PLUS_SIGN:
            return symbols->getSymbol(DecimalFormatSymbols::ENumberFormatSymbol::kPlusSignSymbol);
        case AffixPatternType::TYPE_PERCENT:
            return symbols->getSymbol(DecimalFormatSymbols::ENumberFormatSymbol::kPercentSymbol);
        case AffixPatternType::TYPE_PERMILLE:
            return symbols->getSymbol(DecimalFormatSymbols::ENumberFormatSymbol::kPerMillSymbol);
        case AffixPatternType::TYPE_CURRENCY_SINGLE: {
            
            if (unitWidth == UNumberUnitWidth::UNUM_UNIT_WIDTH_ISO_CODE) {
                return UnicodeString(currencyCode, 3);
            } else if (unitWidth == UNumberUnitWidth::UNUM_UNIT_WIDTH_HIDDEN) {
                return UnicodeString();
            } else {
                UCurrNameStyle selector = (unitWidth == UNumberUnitWidth::UNUM_UNIT_WIDTH_NARROW)
                        ? UCurrNameStyle::UCURR_NARROW_SYMBOL_NAME
                        : UCurrNameStyle::UCURR_SYMBOL_NAME;
                UErrorCode status = U_ZERO_ERROR;
                UBool isChoiceFormat = FALSE;
                int32_t symbolLen = 0;
                const char16_t *symbol = ucurr_getName(
                        currencyCode,
                        symbols->getLocale().getName(),
                        selector,
                        &isChoiceFormat,
                        &symbolLen,
                        &status);
                return UnicodeString(symbol, symbolLen);
            }
        }
        case AffixPatternType::TYPE_CURRENCY_DOUBLE:
            return UnicodeString(currencyCode, 3);
        case AffixPatternType::TYPE_CURRENCY_TRIPLE: {
            
            
            
            U_ASSERT(plural != StandardPlural::Form::COUNT);
            UErrorCode status = U_ZERO_ERROR;
            UBool isChoiceFormat = FALSE;
            int32_t symbolLen = 0;
            const char16_t *symbol = ucurr_getPluralName(
                    currencyCode,
                    symbols->getLocale().getName(),
                    &isChoiceFormat,
                    StandardPlural::getKeyword(plural),
                    &symbolLen,
                    &status);
            return UnicodeString(symbol, symbolLen);
        }
        case AffixPatternType::TYPE_CURRENCY_QUAD:
            return UnicodeString(u"\uFFFD");
        case AffixPatternType::TYPE_CURRENCY_QUINT:
            return UnicodeString(u"\uFFFD");
        default:
            U_ASSERT(false);
            return UnicodeString();
    }
}


void MutablePatternModifier::enterCharSequenceMode(bool isPrefix) {
    U_ASSERT(!inCharSequenceMode);
    inCharSequenceMode = true;

    
    plusReplacesMinusSign = signum != -1
            && (signDisplay == UNUM_SIGN_ALWAYS
                    || signDisplay == UNUM_SIGN_ACCOUNTING_ALWAYS
                    || (signum == 1
                            && (signDisplay == UNUM_SIGN_EXCEPT_ZERO
                                    || signDisplay == UNUM_SIGN_ACCOUNTING_EXCEPT_ZERO)))
            && patternInfo->positiveHasPlusSign() == false;

    
    bool useNegativeAffixPattern = patternInfo->hasNegativeSubpattern() && (
            signum == -1 || (patternInfo->negativeHasMinusSign() && plusReplacesMinusSign));

    
    fFlags = 0;
    if (useNegativeAffixPattern) {
        fFlags |= AffixPatternProvider::AFFIX_NEGATIVE_SUBPATTERN;
    }
    if (isPrefix) {
        fFlags |= AffixPatternProvider::AFFIX_PREFIX;
    }
    if (plural != StandardPlural::Form::COUNT) {
        U_ASSERT(plural == (AffixPatternProvider::AFFIX_PLURAL_MASK & plural));
        fFlags |= plural;
    }

    
    if (!isPrefix || useNegativeAffixPattern) {
        prependSign = false;
    } else if (signum == -1) {
        prependSign = signDisplay != UNUM_SIGN_NEVER;
    } else {
        prependSign = plusReplacesMinusSign;
    }

    
    fLength = patternInfo->length(fFlags) + (prependSign ? 1 : 0);
}

void MutablePatternModifier::exitCharSequenceMode() {
    U_ASSERT(inCharSequenceMode);
    inCharSequenceMode = false;
}

int32_t MutablePatternModifier::length() const {
    U_ASSERT(inCharSequenceMode);
    return fLength;
}

char16_t MutablePatternModifier::charAt(int32_t index) const {
    U_ASSERT(inCharSequenceMode);
    char16_t candidate;
    if (prependSign && index == 0) {
        candidate = u'-';
    } else if (prependSign) {
        candidate = patternInfo->charAt(fFlags, index - 1);
    } else {
        candidate = patternInfo->charAt(fFlags, index);
    }
    if (plusReplacesMinusSign && candidate == u'-') {
        return u'+';
    }
    if (perMilleReplacesPercent && candidate == u'%') {
        return u'‰';
    }
    return candidate;
}

UnicodeString MutablePatternModifier::toUnicodeString() const {
    
    U_ASSERT(false);
    return UnicodeString();
}

#endif 
