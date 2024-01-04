import React, { createRef, useCallback, useEffect, useState } from 'react'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import 'moment/locale/th';

moment.updateLocale("th" , {
    weekdaysShort : ["อา", "จ", "อ", "พุธ", "พฤ", "ศ", "ส"]
})
const DatePickerBuddhist = ({className , Value , onChangeDate , readOnly} : {
    className : string,
    Value : string,
    onChangeDate : (valueDate : string) => {}
    readOnly : boolean,
}) => {
    const RefPaper = createRef<HTMLDivElement>()

    const [ StatePicker , setStatePicker ] = useState<boolean>(false)
    const [ ValuePicker , setValuePicker ] = useState<string>(Value)
    const [ ValueInput , setValueInput ] = useState<string>("")
    const [RefCalendarHeader , setRefCalendarHeader] = useState<HTMLButtonElement | undefined>()

    useEffect(()=>{
        const ValueSpilt : string[] = Value ? Value.split("-") : [];
        if(ValueSpilt[0] !== undefined) {
            ValueSpilt[0] = (parseInt(ValueSpilt[0]) + 543).toString()
            const newDate = ValueSpilt.join("-")
            setValueInput(newDate)
        } else setValueInput("")

        setValuePicker(Value)
    } , [Value])

    useEffect(()=>{
        if(onChangeDate && ValuePicker) onChangeDate(ValuePicker)
    } , [ValuePicker , onChangeDate])

    const setHeader = useCallback((node : HTMLButtonElement | null)=>{
        setTimeout(()=>{
            const nodeRef = node ?? RefCalendarHeader
            if(nodeRef !== undefined && nodeRef !== null) {
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
    const CalendarHeaderLoad = useCallback((node : HTMLButtonElement)=>{
        setHeader(node)
        setRefCalendarHeader(node)
    } , [])

    const HandleDateChangeInput = (event : any) => {
        const valueDate = event._d
        if(valueDate.toString() !== "Invalid Date") {
            const DateTime = new Date(valueDate)
        
            const newYearInput = StatePicker ? DateTime.getFullYear() + 543 : DateTime.getFullYear() 
            const newYear = !StatePicker ? DateTime.getFullYear() - 543 : DateTime.getFullYear()

            const newDateInput = new Date(DateTime.setFullYear(newYearInput))
            const newDate = new Date(DateTime.setFullYear(newYear > 0 ? newYear : newYear + 543))
            setValueInput(newDateInput.toISOString())
            setValuePicker(newDate.toISOString())
        }
    }

    const HandleViewDatePicker = (view : string) => {
        if(view === "year") {
            setTimeout(()=>{
                RefPaper.current?.querySelectorAll(".MuiPickersYear-yearButton").forEach((ele : Element)=>{
                    const newYear = parseInt(ele.innerHTML) + 543
                    ele.innerHTML = newYear.toString()
                })
            } , 1)
        }
    }

    return(
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="th">
            <DateTimePicker
                dayOfWeekFormatter={(day : string , date : any)=>day}
                slotProps={{
                    textField : { 
                        size : "small" , 
                        placeholder : "thanawat@dev" ,
                        value : ValueInput ? moment(`${ValueInput}`) : null,
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
            />
        </LocalizationProvider>
    )
}

export default DatePickerBuddhist