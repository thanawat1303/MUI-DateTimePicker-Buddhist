import React, { createRef, useCallback, useEffect, useState } from 'react'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker , TimeClock } from '@mui/x-date-pickers';
import moment from 'moment';
import 'moment/locale/th';

moment.updateLocale("th" , {
    weekdaysShort : ["อา", "จ", "อ", "พุธ", "พฤ", "ศ", "ส"]
})
const DatePickerFrom = ({className , Value , onChangeDate , readOnly} : {
    className : string,
    Value : string,
    onChangeDate : (valueDate : string) => {}
    readOnly : boolean,
}) => {
    const [ StatePicker , setStatePicker ] = useState(false)

    const [ ValuePicker , setValuePicker ] = useState(Value)
    const [ ValueInput , setValueInput ] = useState<string>("")
    useEffect(()=>{
        const ValueSpilt = Value.split("-")
        if(ValueSpilt[0] !== undefined) {
            ValueSpilt[0] = (parseInt(ValueSpilt[0]) + 543).toString()
            const newDate = ValueSpilt.join("-")
            setValueInput(newDate)
        } else setValueInput("")

        setValuePicker(Value)
    } , [Value])


    const [RefCalendarHeader , setRefCalendarHeader] = useState<HTMLButtonElement | undefined>()
    const CalendarHeaderLoad = useCallback((node : HTMLButtonElement)=>{
        setHeader(node)
        setRefCalendarHeader(node)
    } , [])
    const setHeader = useCallback((node : HTMLButtonElement | null)=>{
        setTimeout(()=>{
            const nodeRef = node ?? RefCalendarHeader
            if(nodeRef !== undefined) {
                const Label = nodeRef.querySelector(".CalendarHeader-label")
                const ArrLebel = Label?.innerHTML.split(" ")
                if(ArrLebel !== undefined && Label) {
                    ArrLebel[1] = (parseInt(ArrLebel[1]) + 543).toString()
                    const newYear = ArrLebel.join(" ")
                    Label.innerHTML = newYear
                }
            }
        } , 1)
    } , [RefCalendarHeader])

    const HandleDateChangeInput = (event : any) => {
        const valueDate = event._d
        const DateTime = new Date(valueDate)
        const DateTimeValue = new Date(valueDate)

        // ใช้ StatePicker ตรวจสอบว่าเป็นการเลือกจาก datepicker หรือ พิมพ์เอง
        const newYearInput = StatePicker ? DateTime.getFullYear() + 543 : DateTime.getFullYear() 
            // ค่าใน input convert ปีเมื่อเลือกจาก datepicker และไม่ convert ปี เมื่อเกิดจากการพิมพ์ 
            // เพราะผู้ใช้จะพิมพ์ปี พศ. จึงเมื่อจะนำไปแสดงผล ไม่จำเป็นต้อง convert แต่หากเลือกค่าจาก datepicker ตัว componant จะให้ค่าปีที่เป็น คศ. จึงต้องนำไป convert ค่าก่อนแสดงบน input
        const newYear = !StatePicker ? DateTime.getFullYear() - 543 : DateTime.getFullYear() 
            // ค่าใน datetime convert ปีเมื่อเกิดจากการพิมพ์ และไม่ convert ปี เมื่อเกิดจากการเลือกจาก datetime
            // เพราะตัว componant จะอ่านค่าด้วยระบบปี คศ. จึงเมื่อจะนำไปใช้งาน จำเป็นจะต้องแปลงปี พศ. ที่ผู้ใช้พิมพ์ เป็นปี คศ. ก่อน 

        const newDateInput = new Date(DateTimeValue.setFullYear(newYearInput))
        const newDate = new Date(DateTime.setFullYear(newYear > 0 ? newYear : newYear + 543))
        setValueInput(newDateInput.toISOString())
        setValuePicker(newDate.toISOString())
    }

    const RefPaper = createRef<HTMLDivElement>()
    const HandleViewDatePicker = (view : any) => {
        if(view === "year") {
            setTimeout(()=>{
                RefPaper.current?.querySelectorAll(".MuiPickersYear-yearButton").forEach((ele , key , parent)=>{
                    const newYear = parseInt(ele.innerHTML) + 543
                    ele.innerHTML = newYear.toString()
                })
            } , 1)
        }
    }

    useEffect(()=>{
        onChangeDate(ValuePicker)
    } , [ValuePicker])

    return(
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="th">
            <DateTimePicker
                dayOfWeekFormatter={(day : string , date : any)=>day}
                slotProps={{
                    textField : { 
                        size : "small" , 
                        placeholder : "วัน/เดือน/ปี" ,
                        value : ValueInput ? moment(`${ValueInput}`) : moment(),
                        error : false
                    },
                    calendarHeader : {
                        ref : CalendarHeaderLoad,
                        classes : {
                            label : "CalendarHeader-label",
                        }
                    },
                    desktopPaper : {
                        ref : RefPaper
                    }
                }}
                onOpen={()=>setStatePicker(true)}
                onClose={()=>setStatePicker(false)}

                onYearChange={()=>setHeader(null)}
                onMonthChange={()=>setHeader(null)}

                onChange={HandleDateChangeInput}
                onViewChange={HandleViewDatePicker}
                className={className}
                ampm={false}
                format='DD MMMM YYYY HH:mm'
                value={ValuePicker ? moment(`${ValuePicker}`) : moment()}
                readOnly={readOnly}
                label="วันที่เผยแพร่"
            />
        </LocalizationProvider>
    )
}