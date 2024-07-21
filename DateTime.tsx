import React from 'react'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import 'moment/locale/th';
import { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps } from '@mui/material';

const DayOfWeek = ["อา", "จ", "อ", "พุธ", "พฤ", "ศ", "ส"]
moment.updateLocale("th" , {
    weekdaysShort : DayOfWeek
})

const DatePickerBuddhist = (props : DateTimePickerProps<Moment> & {
    className? : string;
    Value : string;
    OnChangeDate? : (Date : Date) => void;
    OnAcceptDate? : (Date : Date) => void;
    readOnly? : boolean;
    placeholder? : string;
    size? : "small" | "medium";
    propsInput? : FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps;
}) => {
    const {className , Value , OnChangeDate , OnAcceptDate , readOnly , placeholder , size , propsInput , ...propsDate } = props
    
    const RefPaper = React.createRef<HTMLDivElement>()

    const [ StatePicker , setStatePicker ] = React.useState<boolean>(false)
    const [ ValuePicker , setValuePicker ] = React.useState<string>(
        new Date(Value).toString() !== "Invalid Date" ? new Date(Value).toISOString() : ""
    )
    const [ ValueInput , setValueInput ] = React.useState<string>("")
    const [RefCalendarHeader , setRefCalendarHeader] = React.useState<HTMLDivElement | undefined>()

    React.useEffect(()=>{
        const DateValue = new Date(Value)
        if(DateValue.toString() !== "Invalid Date") {
            const ValueSpilt : string[] = DateValue ? DateValue.toISOString().split("-") : [];
            if(ValueSpilt[0] !== undefined) {
                if(parseInt(ValueSpilt[0])) {
                    ValueSpilt[0] = (parseInt(ValueSpilt[0]) + 543).toString()
                    const newDate = ValueSpilt.join("-")
                    setValueInput(newDate)
                }
            } else setValueInput("")
    
            setValuePicker(DateValue.toISOString())
        }
    } , [Value])

    React.useEffect(()=>{
        const DateValue = new Date(Value)
        const newValue = DateValue.toString() !== "Invalid Date" ? DateValue.toISOString() : "";
        (OnChangeDate && ValuePicker && ValuePicker !== newValue) && OnChangeDate(new Date(ValuePicker))
    } , [ValuePicker , Value , OnChangeDate])

    const setHeader = React.useCallback((node : HTMLDivElement | null)=>{
        setTimeout(()=>{
            const nodeRef = node ?? RefCalendarHeader
            if(nodeRef !== undefined && nodeRef !== null) {
                const Label = nodeRef.querySelector(".CalendarHeader-label")
                const LabelSplitCalendar = Label?.innerHTML.split(" ")
                if(LabelSplitCalendar !== undefined && Label) {
                    LabelSplitCalendar[1] = (parseInt(LabelSplitCalendar[1]) > 543 ? parseInt(LabelSplitCalendar[1]) + 543 : parseInt(LabelSplitCalendar[1])).toString()
                    const newYear = LabelSplitCalendar.join(" ")
                    Label.innerHTML = newYear
                }
            }
        } , 1)
    } , [RefCalendarHeader])

    const CalendarHeaderLoad = React.useCallback((node : HTMLDivElement)=>{
        setHeader(node)
        setRefCalendarHeader(node)
    } , [])

    const HandleDateChangeInput = (event : any) => {
        if(!event) return 0

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
                {...propsDate}
                dayOfWeekFormatter={(date : Moment)=>DayOfWeek[date.day()]}
                slotProps={{
                    textField : { 
                        size : size ? size : "small" , 
                        placeholder : placeholder ? placeholder : "thanawat@dev" ,
                        value : ValueInput ? moment(`${ValueInput}`) : null,
                        error : false,
                        ...propsInput
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
                onAccept={(event)=>event && OnAcceptDate ? OnAcceptDate(new Date(event["_d"])) : null}

                onYearChange={()=>setHeader(null)}
                onMonthChange={()=>setHeader(null)}

                onChange={HandleDateChangeInput}
                onViewChange={HandleViewDatePicker}
                className={className}
                ampm={false}
                format='DD MMMM YYYY HH:mm'
                value={ValuePicker ? moment(`${ValuePicker}`) : null}
                readOnly={readOnly}
            />
        </LocalizationProvider>
    )
}

export default DatePickerBuddhist
