import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.jpg'
import about_image from './about_image.jpg'
import logo from './logo.png'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import m3m from './Service_Centers/3m.png'
import sparkle from './Service_Centers/sparkle.jpg'
import autotech from './Service_Centers/autotech.jpg'
import elma from './Service_Centers/elma.jpg'
import manic from './Service_Centers/manic.jpg'
import sc from './Service_Centers/sc1.png'
import Car_maintenance from './Icons/car_maintenance.png'
import Roadside_asst from './Icons/roadside_asst.png'
import All_round from './Icons/All_round.png'
import Car_wash from './Icons/car_wash.png'
import Car_spares from './Icons/car_spares.png'
import Repairs from './Icons/Repairs.png'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const serviceTypeData = [
    {
        serviceType: 'All Round',
        image: All_round
    },
    {
        serviceType: 'Car Wash',
        image: Car_wash
    },
    {
        serviceType: 'Car Maintenance',
        image: Car_maintenance
    },
    {
        serviceType: 'Repairs',
        image: Repairs
    },
    {
        serviceType: 'Spare Parts',
        image: Car_spares
    },
    {
        serviceType: 'Roadside Assistence',
        image: Roadside_asst
    },
]

export const Centers = [
    {
        _id: 'sc1',
        name: 'B.N.Thakur & Co Garage',
        image: sc,
        serviceType: 'All Round',
        city: 'Panjim',
        contact: '086000 90090',
        services_offered: 'Car wash, Car maintenance, Repairs, Tuning.',
        fees: 50,
        state: 'Goa' 
    },
    {
        _id: 'sc2',
        name: 'Sparkle And Shine Car Wash & Detailer',
        image: sparkle,
        serviceType: 'Car Wash',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa' 
    },
    {
        _id: 'sc3',
        name: '3M Car Care',
        image: m3m,
        serviceType: 'Car Maintenance',
        city: 'Panjim',
        contact: '7745891133',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc4',
        name: 'In & out auto repair',
        image: sc,
        serviceType: 'Repairs',
        city: 'Panjim',
        contact: '7507643553',
        services_offered: 'Engine Repair, Body Repair, etc.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc5',
        name: 'Manic Mechanic',
        image: manic,
        serviceType: 'Spare Parts',
        city: 'Panjim',
        contact: '9422900097',
        services_offered: 'Deals with all types of spare parts',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc6',
        name: 'Autotech Boss',
        image: autotech,
        serviceType: 'All Round',
        city: 'Panjim',
        contact: '7350533618',
        services_offered: 'Car wash, Car maintenance, Repairs, Tuning.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc7',
        name: 'Good Shine Elma',
        image: sc,
        serviceType: 'All Round',
        city: 'Panjim',
        contact: '9921475880',
        services_offered: 'Car wash, Car maintenance, Repairs, Tuning.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc8',
        name: 'Shantadurga foam washing center',
        image: sc,
        serviceType: 'Car Wash',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc9',
        name: 'Car Clean n Care',
        image: sc,
        serviceType: 'Car Wash',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc10',
        name: 'Sandeep Garage ',
        image: sc,
        serviceType: 'Spare Parts',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc11',
        name: 'Detailing Daddy',
        image: sc,
        serviceType: 'All Round',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc12',
        name: 'Shree Service Point',
        image: sc,
        serviceType: 'Car Maintenance',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc13',
        name: 'Talaulikar Auto Services',
        image: sc,
        serviceType: 'Repairs',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc14',
        name: 'WOW Car Wash',
        image: sc,
        serviceType: 'Roadside Assistence',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
    {
        _id: 'sc15',
        name: 'Sparkles Auto nx',
        image: sc,
        serviceType: 'Repairs',
        city: 'Panjim',
        contact: '9326790578',
        services_offered: 'Car wash, Car maintenance.',
        fees: 20,
        state: 'Goa'
    },
]