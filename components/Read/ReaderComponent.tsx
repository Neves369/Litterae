import { Reader, useReader } from "@epubjs-react-native/core";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slider } from "@miblanchard/react-native-slider";
import { StatusBar } from "expo-status-bar";
// import I18n from 'i18n-js'
import React, { memo, useEffect, useLayoutEffect, useState } from "react";
import { PanResponder, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoaderBook from "../Loader/LoaderBook";
import {
  AntDesign,
  Entypo,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
// import { useTypedNavigation } from '../../../hook/useTypedNavigation'
// import { useTypedSelector } from '../../../hook/useTypedSelector'
// import { useAddBookToEndedBookMutation, useAddBookToStartReadingMutation } from '../../../store/api/book/mutation'
// import Loader from '../../ui/Loader'
import Settings from "./ui/Settings/Settings";
import { dark, light, sepia } from "./ui/Theme";

const ReaderComponent = (props: {
  LastReadPage: string;
  epub: string;
  BookId: string | number;
  ReadEpub: string;
}) => {
  const [toc, setToc] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState(light);
  const [fontSize, setFontSize] = useState(0);
  const { width, height } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(false);
  const [fontFamiles, setFontFamiles] = useState("Arial");
  const [LoadingfontSize, setLoadingFontSize] = useState(0);
  const [totalLocations, setTotalLocations] = useState<any>();

  // dialog de close
  const DOUBLE_PRESS_DELAY = 400;
  const [lastTap, setLastTap] = useState(0);
  const [isTerminated, setTerminated] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const {
    changeFontSize,
    currentLocation,
    searchResults,
    search,
    goToLocation,
    changeFontFamily,
    changeTheme,
    // getLocations,
  } = useReader();

  useLayoutEffect(() => {
    const parseLastPage = async () => {
      try {
        const value = await AsyncStorage.getItem(props.epub + "font");
        const themes = await AsyncStorage.getItem(props.epub + "theme");
        const fontfamily = await AsyncStorage.getItem(
          props.epub + "fontFamily"
        );
        if (themes && value && fontfamily != null) {
          //   setTheme(JSON.parse(themes));
          //   setLoadingFontSize(Number(value));
          //   setFontFamiles(fontfamily ? fontfamily : "Arial");
        }
      } catch (e) {
        console.log(e);
      }
    };
    parseLastPage();
  }, []);

  // exibe o menu
  function ShowMenu(show: boolean) {
    setShow(show);
  }

  if (!props) return <LoaderBook />;

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <View
        style={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SafeAreaView>
          <Reader
            enableSelection={false}
            initialLocation={props.LastReadPage}
            src={props.ReadEpub + ".epub"}
            renderOpeningBookComponent={() => <LoaderBook />}
            fileSystem={useFileSystem}
            width={width}
            onDoublePress={() => {
              ShowMenu(!show);
            }}
            onNavigationLoaded={(toc) => {
              setToc(toc.toc);
              setFontSize(LoadingfontSize);
              changeTheme(theme);
              changeFontFamily(fontFamiles);
            }}
            onSwipeLeft={async () => {
              // @ts-ignore
              await AsyncStorage.setItem(props.BookId, currentLocation.end.cfi);
              await AsyncStorage.setItem(
                props.BookId + "font",
                fontSize.toString()
              );
              await AsyncStorage.setItem(
                props.BookId + "theme",
                JSON.stringify(theme)
              );
              await AsyncStorage.setItem(
                props.BookId + "fontFamily",
                fontFamiles
              );
              await AsyncStorage.setItem(
                "ContinueRead",
                JSON.stringify({
                  BookId: props.BookId,
                  LastReadPage: currentLocation?.end.cfi,
                  // epub: props.epub,
                  interest: currentLocation?.end.percentage,
                })
              );
            }}
            onSwipeRight={async () => {
              // @ts-ignore
              await AsyncStorage.setItem(props.BookId, currentLocation.end.cfi);
              await AsyncStorage.setItem(
                props.BookId + "font",
                fontSize.toString()
              );
              await AsyncStorage.setItem(
                props.BookId + "theme",
                JSON.stringify(theme)
              );
              await AsyncStorage.setItem(
                props.BookId + "fontFamily",
                fontFamiles
              );
              await AsyncStorage.setItem(
                "ContinueRead",
                JSON.stringify({
                  BookId: props.BookId,
                  LastReadPage: currentLocation?.end.cfi,
                  // epub: props.epub,
                  interest: currentLocation?.end.percentage,
                })
              );
            }}
            onFinish={async () => {
              await AsyncStorage.removeItem(props.epub);
            }}
            renderLoadingFileComponent={() => <LoaderBook />}
            enableSwipe={true}
            height={height}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              height: show ? "50%" : 0,
              width: "100%",
              // backgroundColor: "red",
            }}
          >
            <Settings
              BookId={props.BookId}
              toc={toc}
              isVisible={show}
              setIsVisible={setIsVisible}
              search={search}
              searchResults={searchResults}
              changeTheme={changeTheme}
              setTheme={setTheme}
              theme={theme}
              currentLocation={currentLocation}
              goToLocation={goToLocation}
              changeFontSize={changeFontSize}
              changeFontFamily={changeFontFamily}
              fontFamiles={fontFamiles}
              fontSize={fontSize}
              setFontFamiles={setFontFamiles}
              setFontSize={setFontSize}
            />
            <Text
              style={{
                backgroundColor:
                  theme.body.background === "#121212" ? "#282828" : "#121212",
                color: "#fff",
                borderTopColor: "rgba(100, 103, 109, 0.2)",
                borderTopWidth: 1,
              }}
            >
              {currentLocation?.end.percentage
                ? (" " + currentLocation.end.percentage * 100)
                    .toString()
                    .slice(0, 4) + "%"
                : ""}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

export default memo(ReaderComponent);
