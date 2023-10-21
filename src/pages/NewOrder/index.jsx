import React, { useState } from 'react'
import styles from './index.module.css'
import { CheckItem, CheckoutMenu, CustomerForm, FinalReceipt, NewOrderServiceItem, NewOrderServiceType } from '../../components'
import { useCheckout } from '../../contexts/CheckoutContext'
import { useService } from '../../contexts/ServiceContext'

export default function NewOrder() {

  const { checkItemActive, checkReceiptActive, customerFormActive, checkItem, checkout } = useCheckout()
  const { allServices, service } = useService()

  const [activeService, setActiveService] = useState(null);

  const serviceTypes = ["cleaning", "press-only", "household", "alterations"]

  const handleServiceTypeClick = (serviceId) => {
    setActiveService(serviceId);
  };

  return (
    <section className={styles['new-order']}>
      <div className={styles['services']}>
        <ul className={styles['service-list']}>
          {serviceTypes.map((s, i) => 
            <NewOrderServiceType
              key={i}
              serviceName={s}
              id={s}
              isActive={activeService === s}
              handleService={() => handleServiceTypeClick(s)}
            />)
          }
        </ul>
        <ul className={styles['service-items-list']}>
          {service.length ? 
          (service?.map((s, i) => <NewOrderServiceItem serviceName={s.name} servicePrice={s.price} additional={s.additional} tag={s.tag} key={i} />) )
          : 
          (allServices?.map((s, i) => <NewOrderServiceItem serviceName={s.name} servicePrice={s.price} additional={s.additional} tag={s.tag} key={i} />) )
          }
        </ul>
      </div>
      <CheckoutMenu />
      {checkItemActive ? <CheckItem item={checkItem} /> : null}
      {checkReceiptActive ? <FinalReceipt /> : null}
      {customerFormActive ? <CustomerForm item={checkout} /> : null}
    </section>
  )
}