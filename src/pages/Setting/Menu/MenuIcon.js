import React from 'react';
import {Icon} from "antd";

const icons = [
    {
        title: '方向性图标',
        anchor: 'direction',
        list: ["step-backward", "step-forward", "fast-backward", "fast-forward", "shrink", "arrows-alt", "down", "up", "left", "right", "caret-up", "caret-down", "caret-left", "caret-right", "up-circle", "down-circle", "left-circle", "right-circle", "up-circle-o", "down-circle-o", "right-circle-o", "left-circle-o", "double-right", "double-left","forward", "backward", "rollback", "enter", "retweet", "swap", "swap-left", "swap-right", "arrow-up", "arrow-down", "arrow-left", "arrow-right", "play-circle", "play-circle-o", "up-square", "down-square", "left-square", "right-square", "up-square-o", "down-square-o", "left-square-o", "right-square-o", "login", "logout", "menu-fold", "menu-unfold"],
    },
    {
        title: '提示建议性图标',
        anchor: 'suggestion',
        list: ["question", "question-circle-o", "question-circle", "plus", "plus-circle-o", "plus-circle", "pause", "pause-circle-o", "pause-circle", "minus", "minus-circle-o", "minus-circle", "plus-square", "plus-square-o", "minus-square", "minus-square-o", "info", "info-circle-o", "info-circle", "exclamation", "exclamation-circle-o", "exclamation-circle", "close", "close-circle", "close-circle-o", "close-square", "close-square-o", "check", "check-circle", "check-circle-o", "check-square", "check-square-o", "clock-circle-o", "clock-circle"],
    },
    {
        title: '网站通用图标',
        anchor: 'logo',
        list: ["lock", "unlock", "area-chart", "pie-chart", "bar-chart", "dot-chart", "bars", "book", "calendar", "cloud", "cloud-download", "code", "code-o", "copy", "credit-card", "delete", "desktop", "download", "edit", "ellipsis", "file", "file-text", "file-unknown", "file-pdf", "file-excel", "file-jpg", "file-ppt", "file-add", "folder", "folder-open", "folder-add", "hdd", "frown", "frown-o", "meh", "meh-o", "smile", "smile-o", "inbox", "laptop", "appstore-o", "appstore", "line-chart", "link", "mail", "mobile", "notification", "paper-clip", "picture", "poweroff", "reload", "search", "setting", "share-alt", "shopping-cart", "tablet", "tag", "tag-o", "tags", "tags-o", "to-top", "upload", "user", "video-camera", "home", "loading", "loading-3-quarters", "cloud-upload-o", "cloud-download-o", "cloud-upload", "cloud-o", "star-o", "star", "heart-o", "heart", "environment", "environment-o", "eye", "eye-o", "camera", "camera-o", "save", "team", "solution", "phone", "filter", "exception", "export", "customer-service", "qrcode", "scan", "like", "like-o", "dislike", "dislike-o", "message", "pay-circle", "pay-circle-o", "calculator", "pushpin", "pushpin-o", "bulb", "select", "switcher", "rocket", "bell", "disconnect", "database", "compass", "barcode", "hourglass", "key", "flag", "layout", "printer", "sound", "usb", "skin", "tool", "sync", "wifi", "car", "schedule", "user-add", "user-delete", "usergroup-add", "usergroup-delete", "man", "woman", "shop", "gift", "idcard", "medicine-box", "red-envelope", "coffee", "copyright", "trademark", "safety", "wallet", "bank", "trophy", "contacts", "global", "shake", "api"]
    },
    {
        title: '品牌和标识',
        anchor: 'other',
        list: ["android", "android-o", "apple", "apple-o", "windows", "windows-o", "ie", "chrome", "github", "aliwangwang", "aliwangwang-o", "dingding", "dingding-o"],
    }
];

class MenuIcon extends React.Component {
    render() {
        return (
            <div style={styles.gridParentDiv}>
                {
                    icons.map(item => {
                        return (
                            item.list.map(icon => {
                                return (
                                    <div style={styles.gridDiv} key={icon} onClick={() => this.props.onSelectChange(icon)} >
                                        <div style={styles.gridItem}>
                                            <Icon type={icon} style={styles.icon}/>
                                            &emsp;
                                            <span>{icon}</span>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    })
                }
            </div>
        )
    }
}

const styles = {
    gridParentDiv:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height:'250px',
        overflow: 'auto'
    },
    gridDiv: {
        width:'33%'
    },
    gridItem:{
        display: 'flex',
        flexDirection: 'row'

    },
    icon: {
        fontSize: 18,
        marginBottom: 10
    },
};

export default MenuIcon;
