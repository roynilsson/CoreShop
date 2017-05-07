<?php

namespace CoreShop\Component\Core\Notification\Rule\Condition\Order;

use CoreShop\Component\Notification\Rule\Condition\AbstractConditionChecker;
use CoreShop\Component\Order\Model\OrderInterface;

class OrderStateChecker extends AbstractConditionChecker
{
    /**
     *
     */
    const TRANSITION_TO = 1;

    /**
     *
     */
    const TRANSITION_FROM = 2;

    /**
     *
     */
    const TRANSITION_ALL = 3;

    /**
     * {@inheritdoc}
     */
    public function isNotificationRuleValid($subject, $params, array $configuration)
    {
        if ($subject instanceof OrderInterface) {
            $paramsToExist = [
                'fromState',
                'toState'
            ];

            foreach ($paramsToExist as $paramToExist) {
                if (!array_key_exists($paramToExist, $params)) {
                    return false;
                }
            }

            $fromState = $params['fromState'];
            $toState = $params['toState'];

            if ($configuration['transitionType'] === self::TRANSITION_TO) {
                if (in_array($toState, $configuration['states'])) {
                    return true;
                }
            } elseif ($configuration['transitionType'] === self::TRANSITION_FROM) {
                if (in_array($fromState, $configuration['states'])) {
                    return true;
                }
            } elseif ($configuration['transitionType'] === self::TRANSITION_ALL) {
                if (in_array($fromState, $configuration['states']) || in_array($toState, $configuration['states'])) {
                    return true;
                }
            }
        }

        return false;
    }
}