import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { CheckItem, CheckoutMenu, CustomerForm, Discount, FinalReceipt, NewOrderServiceItem, NewOrderServiceType } from '../../components'
import { useCheckout } from '../../contexts/CheckoutContext'
import { useService } from '../../contexts/ServiceContext'
import useSearch from '../../hooks/useSearch'

export default function NewOrder() {

  const { checkItemActive, checkReceiptActive, customerFormActive, discountFormActive, checkItem, checkout } = useCheckout()
  const { allServices, service, setService } = useService()
  const { setQuery, result } = useSearch(allServices, "service");

  const [activeService, setActiveService] = useState(null);

  const serviceTypes = ["cleaning", "press-only", "household", "alterations", "repairs"]

  const handleServiceTypeClick = (serviceId) => {
    setActiveService(serviceId);
    setQuery("")
  };

  useEffect(() => {
    setActiveService(null)
    setService([])
    setQuery("")
  }, [])

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
        {!service.length ? <input className={styles['search-bar']} onChange={(e) => setQuery(e.target.value)} placeholder='Search for Item' type="text" /> : null}
        <ul className={styles['service-items-list']}>
          {service.length ? 
          (service?.map((s, i) => <NewOrderServiceItem id={s.id} serviceName={s.name} servicePrice={s.price} additional={s.additional} tag={s.tag} key={i} />) )
          : 
          (result?.map((s, i) => <NewOrderServiceItem id={s.id} serviceName={s.name} servicePrice={s.price} additional={s.additional} tag={s.tag} key={i} />) )
          }
        </ul>
      </div>
      <CheckoutMenu />
      {checkItemActive ? <CheckItem item={checkItem} /> : null}
      {checkReceiptActive ? <FinalReceipt /> : null}
      {customerFormActive ? <CustomerForm item={checkout} /> : null}
      {discountFormActive ? <Discount item={checkout} /> : null}
    </section>
  )
}