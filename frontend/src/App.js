import axios from "axios";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import Pagination from "./components/Pagination";
import { FormControl } from '@mui/material';
import Select from 'react-select'
const order_options = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'ascending' }
  ]
  const sort_options = [
    { value: 'activity', label: 'Activity' },
    { value: 'votes', label: 'votes' },
    { value: 'creation', label: 'Creation' },
    { value: 'relevance', label: 'Relevance' },
  ]
  const closed_options = [
    { value: '', label: '' },
    { value: 'True', label: 'True' },
    { value: 'False', label: 'False' }
  ]
  const migrated_options = [
    { value: '', label: '' },
    { value: 'True', label: 'True' },
    { value: 'False', label: 'False' }
  ]
  const notice_options = [
    { value: '', label: '' },
    { value: 'True', label: 'True' },
    { value: 'False', label: 'False' }
  ]
  const accepted_options = [
    { value: '', label: '' },
    { value: 'True', label: 'True' },
    { value: 'False', label: 'False' }
  ]
  const wiki_options = [
    { value: '', label: '' },
    { value: 'True', label: 'True' },
    { value: 'False', label: 'False' }
  ]
function App() {
    const baseURL = "http://127.0.0.1:8000/test/";

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const searchFilter = (values) => {
        let fromDate =  new Date(values.fromdate).getTime();
        let toDate = new Date(values.todate).getTime();
        let minDate = new Date(values.min).getTime();
        let maxDate = new Date(values.max).getTime();
        console.log("fromDate:-",fromDate)
        console.log("fromDate:-",typeof fromDate)
        if (fromDate.toString()==='NaN'){
            fromDate=''
        }
        if (toDate.toString()==='NaN'){
            toDate=''
        }
        if (minDate.toString()==='NaN'){
            minDate=''
        }
        if (maxDate.toString()==='NaN'){
            maxDate=''
        }
        
        setLoading(true);

        axios
            .get(baseURL, {
                params: {
                    q: values.q,
                    accepted: values.accepted,
                    answers:values.answers,
                    body: values.body,
                    closed: values.closed,
                    migrated: values.migrated,
                    notice: values.notice,
                    nottagged: values.nottagged,
                    tagged: values.tagged,
                    title: values.title,
                    user: values.user,
                    url: values.url,
                    views: values.views,
                    wiki:values.wiki,
                    fromdate: fromDate,
                    todate: toDate,
                    page: values.page,
                    pagesize: values.pagesize,
                    order: values.order,
                    sort: values.sort,
                    min: minDate,
                    max: maxDate,
                    
                    
                    site: "stackoverflow",
                    
                    
                    
                },
                headers: {
                    Authorization:
                        "Token " + "eb41cd4f6696a83f097f88a07692414891eaeb4c", //the token is a variable which holds the token
                },
            })
            .then((response) => {
                setResult(response.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log("Error", e);
                setLoading(false);
            });
    };

    return (
        <div>
            <div className="container" style={{ marginTop: "20px" }}>
                <Formik
                    initialValues={{
                        page: "",
                        pagesize: "",
                        fromdate: "",
                        todate: "",
                        order: "",
                        min: "",
                        max: "",
                        sort: "",
                        q: "",
                        accepted: "",
                        answers: "",
                        body: "",
                        closed: "",
                        migrated: "",
                        notice: "",
                        nottagged: "",
                        tagged: "",
                        title: "",
                        user: "",
                        url: "",
                        views: "",
                        wiki: "",
                    }}
                    onSubmit={(values) => searchFilter(values)}
                >
                    {({ setFieldValue }) => (
                        <Form className="row g-3 mt-3">
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label">Page</label>
                                    <Field
                                        min={1}
                                        name="page"
                                        type="number"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Page Size</label>
                                    <Field
                                        min={1}
                                        name="pagesize"
                                        type="number"
                                        className="form-control"
                                    />
                                </div>
                                
                                <div className="col-md-4">
                                    <label className="form-label">
                                        From Date
                                    </label>
                                    <Field
                                        name="fromdate"
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">
                                        To Date
                                    </label>
                                    <Field
                                        name="todate"
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4"> 
                                    <FormControl>
                                    <label>Order:
                                    </label>
                                    <Select options={order_options} onChange={(data) => { setFieldValue('order', data.value) }} />
                                    </FormControl>
                                </div> 
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Min
                                    </label>
                                    <Field
                                        name="min"
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">
                                        Max
                                    </label>
                                    <Field
                                        name="max"
                                        type="date"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">     
                                    <FormControl>
                                    <label>Sort:
                                    </label>
                                    <Select options={sort_options} onChange={(data) => { setFieldValue('sort', data.value) }} />
                                    </FormControl>
                                </div> 
                                <div className="col-md-4">
                                    <FormControl>
                                    <label>Accepted:
                                    </label>
                                    <Select options={accepted_options} onChange={(data) => { setFieldValue('accepted', data.value) }} />
                                    </FormControl>
                                </div>    
                                <div className="col-md-4">
                                    <label className="form-label">Answers</label>
                                    <Field
                                        min={1}
                                        name="answers"
                                        type="number"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">q</label>
                                    <Field
                                        name="q"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Body</label>
                                    <Field
                                        name="body"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <FormControl>
                                    <label>Closed:
                                    </label>
                                    <Select options={closed_options} onChange={(data) => { setFieldValue('closed', data.value) }} />
                                    </FormControl>
                                </div>
                                <div className="col-md-4">    
                                    <FormControl>
                                    <label>Migrated:
                                    </label>
                                    <Select options={migrated_options} onChange={(data) => { setFieldValue('migrated', data.value) }} />
                                    </FormControl>
                                </div>
                                <div className="col-md-4">    
                                    <FormControl>
                                    <label>Notice:
                                    </label>
                                    <Select options={notice_options} onChange={(data) => { setFieldValue('notice', data.value) }} />
                                    </FormControl>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Not Tagged</label>
                                    <Field
                                        name="notagged"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Tagged</label>
                                    <Field
                                        name="tagged"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Title</label>
                                    <Field
                                        name="title"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">User</label>
                                    <Field
                                        min={1}
                                        name="user"
                                        type="number"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">url</label>
                                    <Field
                                        name="url"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Views</label>
                                    <Field
                                        min={1}
                                        name="views"
                                        type="number"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <FormControl>
                                    <label>Wiki:
                                    </label>
                                    <Select options={wiki_options} onChange={(data) => { setFieldValue('wiki', data.value) }} />
                                    </FormControl>
                                </div>  
                            </div>
                            <div className="row mb-3">
                                
                                
                               
                              
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-md btn-primary ">
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <Pagination itemsPerPage={5} items={result} loading={loading} />
            </div>
        </div>
    );
}

export default App;
