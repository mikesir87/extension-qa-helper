package main

import (
	"flag"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

func main() {
	var socketPath string
	flag.StringVar(&socketPath, "socket", "/run/guest/volumes-service.sock", "Unix domain socket to listen on")
	flag.Parse()

	os.RemoveAll(socketPath)

	logrus.New().Infof("Starting listening on %s\n", socketPath)
	router := echo.New()
	router.HideBanner = true

	startURL := ""

	ln, err := listen(socketPath)
	if err != nil {
		log.Fatal(err)
	}
	router.Listener = ln

	router.GET("/hello", hello)
	router.GET("/proxy", proxy)

	log.Fatal(router.Start(startURL))
}

func listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}

func hello(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, HTTPMessageBody{Message: "hello"})
}

type ProxyData struct {
	Status int    `json:"status"`
	Data   string `json:"data"`
}

func proxy(ctx echo.Context) error {
	url := ctx.QueryParam("url")
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Search-Version", "v3")
	resp, err := client.Do(req)
	if err != nil {
		return ctx.JSON(http.StatusOK, ProxyData{
			Status: resp.StatusCode,
			Data:   err.Error(),
		})
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return ctx.JSON(http.StatusOK, ProxyData{
			Status: 500,
			Data:   err.Error(),
		})
	}
	sb := string(body)
	return ctx.JSON(http.StatusOK, ProxyData{
		Status: resp.StatusCode,
		Data:   sb,
	})
}

type HTTPMessageBody struct {
	Message string
}