import React from 'react'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import 'moment/locale/th';

moment.updateLocale("th" , {
    weekdaysShort : ["อา", "จ", "อ", "พุธ", "พฤ", "ศ", "ส"]
})

const DatePickerBuddhist = (props : DateTimePickerProps<Moment> & {
    className : string,
    Value : string,
    OnChangeDate : (valueDate : string) => void,
    OnAcceptDate : (valueDate : string) => void
    readOnly : boolean,
}) => {
    const RefPaper = React.createRef<HTMLDivElement>()

    const [ StatePicker , setStatePicker ] = React.useState<boolean>(false)
    const [ ValuePicker , setValuePicker ] = React.useState<string>(props.Value)
    const [ ValueInput , setValueInput ] = React.useState<string>("")
    const [RefCalendarHeader , setRefCalendarHeader] = React.useState<HTMLButtonElement | undefined>()

    React.useEffect(()=>{
        const ValueSpilt : string[] = props.Value ? props.Value.split("-") : [];
        if(ValueSpilt[0] !== undefined) {
            ValueSpilt[0] = (parseInt(ValueSpilt[0]) + 543).toString()
            const newDate = ValueSpilt.join("-")
            setValueInput(newDate)
        } else setValueInput("")

        setValuePicker(props.Value)
    } , [props.Value])

    React.useEffect(()=>{
        if(props.OnChangeDate && ValuePicker) props.OnChangeDate(new Date(ValuePicker).toString())
    } , [ValuePicker , props.OnChangeDate])

    const setHeader = React.useCallback((node : HTMLButtonElement | null)=>{
        setTimeout(()=>{
            const nodeRef = node ?? RefCalendarHeader
            if(nodeRef !== undefined && nodeRef !== null) {
                const Label = nodeRef.querySelector(".CalendarHeader-label")
                const ArrLebel = Label?.innerHTML.split(" ")
                if(ArrLebel !== undefined && Label) {
                    ArrLebel[1] = (parseInt(ArrLebel[1]) > 543 ? parseInt(ArrLebel[1]) + 543 : parseInt(ArrLebel[1])).toString()
                    const newYear = ArrLebel.join(" ")
                    Label.innerHTML = newYear
                }
            }
        } , 1)
    } , [RefCalendarHeader])
    const CalendarHeaderLoad = React.useCallback((node : HTMLButtonElement)=>{
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
            const newDate = new Date(DateTime.setFullYear(newYear > 0 ? newYear : 0))

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
                {...props}
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
                onAccept={(event)=>event ? props.OnAcceptDate(new Date(event["_d"]).toISOString()) : null}

                onYearChange={()=>setHeader(null)}
                onMonthChange={()=>setHeader(null)}

                onChange={HandleDateChangeInput}
                onViewChange={HandleViewDatePicker}
                className={props.className}
                ampm={false}
                format='DD MMMM YYYY HH:mm'
                value={ValuePicker ? moment(`${ValuePicker}`) : null}
                readOnly={props.readOnly}
            />
        </LocalizationProvider>
    )
}

export default DatePickerBuddhist