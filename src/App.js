import "./App.css";
import { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

// whne loading give -
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

function App() {
    const [model, setModel] = useState(null);
    const [image, setImage] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingGraph, setLoadingGraph] = useState(false);
    const inputRef = useRef(null);
    const barColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#FC33FF", "#F6FF33"];
    const modelURL =
        "https://storage.googleapis.com/tm-model/lGlztLmUl/model.json";
    const metadataURL =
        "https://storage.googleapis.com/tm-model/lGlztLmUl/metadata.json";

    useEffect(() => {
        console.log("img", image);
        if (!image) {
            return;
        }
        setLoadingGraph(true);
        const image2 = document.getElementById("disease_img");
        const fetchData = async () => {
            const model = await tmImage.load(modelURL, metadataURL);
            setModel(model);
        };
        fetchData();
        if (!model) return;
        const timer = setTimeout(() => {
            const predict = async () => {
                return await model.predict(image2, false);
            };
            predict().then((vals) => {
                const data = vals.map((el) => {
                    return {
                        className: el.className,
                        probability: (el.probability * 100).toFixed(2),
                    };
                });
                setLoadingGraph(false);
                setData(data);
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [image]);

    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setLoading(false);
        }
    };

    const onUploadImage = () => {
        setLoading(true);
        inputRef.current?.click();
    };

    return (
        <div>
            <main role="main">
                <div className="jumbotron d-flex align-items-center justify-content-center">
                    <div className="container">
                        <h1 className="display-3">
                            Detect Common Skin Diseases !
                        </h1>
                        <p>
                            This is an application which enables common users to
                            find out about skin diseases from the comfort of
                            their home.
                        </p>
                        <div className="row">
                            <div className="col-sm">
                                <input
                                    type="file"
                                    ref={inputRef}
                                    className="d-none"
                                    onChange={onImageChange}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={onUploadImage}
                                >
                                    {loading && (
                                        <span
                                            className="spinner-border text-warning"
                                            role="status"
                                        ></span>
                                    )}
                                    {!loading && (
                                        <span>
                                            <i className="bi bi-upload"></i>{" "}
                                            Upload Pictures
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <img
                                    id="disease_img"
                                    src={image}
                                    alt=""
                                    className="mt-5"
                                    crossOrigin="anonymous"
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col chart-col">
                                {image && (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={400}
                                    >
                                        <BarChart
                                            data={data}
                                            layout="vertical"
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 100,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                type="number"
                                                dataKey="probability"
                                                style={{
                                                    fontFamily: "Comic Sans MS",
                                                }}
                                            />
                                            <YAxis
                                                dataKey="className"
                                                type="category"
                                                style={{
                                                    fontFamily: "Comic Sans MS",
                                                }}
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="probability"
                                                barSize={20}
                                            >
                                                {data?.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            barColors[
                                                                index % 20
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
