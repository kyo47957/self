const $ = new Env('����ũ��');
let cookiesArr = ['pt_key=AAJijKDvADB9xDpZr0wfcZ1kzCwX4MqwNQ_I6UYBPEJzHhMcglve6HTIBzqNnYCdlybO7QoO07g;pt_pin=kyo47957'], cookie = '', isBox = false, newShareCodes, allMessage = '';
let notify = $.isNode() ? require('./sendNotify') : '';
let shareCodes = [
  'b1638a774d054a05a30a17d3b4d364b8@f92cb56c6a1349f5a35f0372aa041ea0@9c52670d52ad4e1a812f894563c746ea@8175509d82504e96828afc8b1bbb9cb3@2673c3777d4443829b2a635059953a28@d2d5d435675544679413cb9145577e0f',
]
let message = '', subTitle = '', option = {}, isFruitFinished = false;
const retainWater = 100;//����ˮ�δ��ڶ���g,Ĭ��100g;
let jdNotify = false;//�Ƿ�ر�֪ͨ��false��֪ͨ���ͣ�true�ر�֪ͨ����
let jdFruitBeanCard = false;//ũ��ʹ��ˮ�λ�����(���������ʱ�ʱ100gˮ��20��,��ʱ�Ƚ�ˮ����,�Ƽ�����),true��ʾ����(����ˮ),false��ʾ������(������ˮ),�ű�Ĭ���ǽ�ˮ
let randomCount = $.isNode() ? 20 : 5;
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const urlSchema = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D`;

!(async () => {
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n��ʼ�������˺�${$.index}��${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `����ʾ��cookie��ʧЧ`, `�����˺�${$.index} ${$.nickName || $.UserName}\n�����µ�¼��ȡ\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie��ʧЧ - ${$.UserName}`, `�����˺�${$.index} ${$.UserName}\n�����µ�¼��ȡcookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      option = {};
      await jdFruit();
    }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
    .catch((e) => {
      $.log('', `? ${$.name}, ʧ��! ԭ��: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function jdFruit() {
  subTitle = `�������˺�${$.index}��${$.nickName}`;
  try {
    await initForFarm();
    if ($.farmInfo.farmUserPro) {  
      message = `��ˮ�����ơ�${$.farmInfo.farmUserPro.name}\n`;
      console.log(`\n�������˺�${$.index}��${$.UserName}����${$.name}���ѻ����롿${$.farmInfo.farmUserPro.shareCode}\n`);
      console.log(`\n���ѳɹ��һ�ˮ����${$.farmInfo.farmUserPro.winTimes}��\n`);
      message += `���Ѷһ�ˮ����${$.farmInfo.farmUserPro.winTimes}��\n`;
      if ($.farmInfo.treeState === 2 || $.farmInfo.treeState === 3) {
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `�������˺�${$.index}��${$.nickName || $.UserName}\n������?��${$.farmInfo.farmUserPro.name}�ѿ���ȡ\n��ȥ����APP��΢��С����鿴\n�����������`, option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - �˺�${$.index} - ${$.nickName}ˮ���ѿ���ȡ`, `�������˺�${$.index}��${$.nickName || $.UserName}\n������?��${$.farmInfo.farmUserPro.name}�ѿ���ȡ\n��ȥ����APP��΢��С����鿴`);
        }
        return
      } else if ($.farmInfo.treeState === 1) {
        console.log(`\n${$.farmInfo.farmUserPro.name}��ֲ��...\n`)
      } else if ($.farmInfo.treeState === 0) {
        //���µ�����, ��δ��ʼ��ֲ�µ�ˮ��
        option['open-url'] = urlSchema;
        $.msg($.name, ``, `�������˺�${$.index}�� ${$.nickName || $.UserName}\n������?����������ֲ�µ�ˮ��\n��ȥ����APP��΢��С����ѡ������ֲ�µ�ˮ��\n�����������`, option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - ��������ֲ�µ�ˮ��`, `�����˺�${$.index} ${$.nickName}\n������?����������ֲ�µ�ˮ��\n��ȥ����APP��΢��С����ѡ������ֲ�µ�ˮ��`);
        }
        return
      }
      await doDailyTask();
      await doTenWater();//��ˮʮ��
      await getFirstWaterAward();//��ȡ�״ν�ˮ����
      await getTenWaterAward();//��ȡ10��ˮ����
      await getWaterFriendGotAward();//��ȡΪ2���ѽ�ˮ����
      await duck();
      await doTenWaterAgain();//�ٴν�ˮ
      await predictionFruit();//Ԥ��ˮ������ʱ��
    } else {
      console.log(`��ʼ��ũ�������쳣, ���¼���� app�鿴ũ��0Ԫˮ�������Ƿ�����,ũ����ʼ������: ${JSON.stringify($.farmInfo)}`);
      message = `�������쳣�����ֶ���¼����app�鿴���˺�${$.name}�Ƿ�����`;
    }
  } catch (e) {
    console.log(`����ִ���쳣������ִ����־ ????`);
    $.logErr(e);
    const errMsg = `�����˺�${$.index} ${$.nickName || $.UserName}\n����ִ���쳣������ִ����־ ????`;
    if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
    $.msg($.name, '', `${errMsg}`)
  }
  await showMsg();
}

async function doDailyTask() {
  await taskInitForFarm();
  console.log(`��ʼǩ��`);
  if (!$.farmTask.signInit.todaySigned) {
    await signForFarm(); //ǩ��
    if ($.signResult.code === "0") {
      console.log(`��ǩ���ɹ������${$.signResult.amount}g?\\n`)
      //message += `��ǩ���ɹ������${$.signResult.amount}g?\n`//����ǩ��${signResult.signDay}��
    } else {
      // message += `ǩ��ʧ��,��ѯ��־\n`;
      console.log(`ǩ�����:  ${JSON.stringify($.signResult)}`);
    }
  } else {
    console.log(`������ǩ��,����ǩ��${$.farmTask.signInit.totalSigned},�´�ǩ���ɵ�${$.farmTask.signInit.signEnergyEachAmount}g\n`);
  }
  // ��ˮ������
  console.log(`��ˮ�����У� ${$.farmInfo.todayGotWaterGoalTask.canPop ? '��' : '��'}`);
  if ($.farmInfo.todayGotWaterGoalTask.canPop) {
    await gotWaterGoalTaskForFarm();
    if ($.goalResult.code === '0') {
      console.log(`����ˮ�����С����${$.goalResult.addEnergy}g?\\n`);
      // message += `����ˮ�����С����${$.goalResult.addEnergy}g?\n`
    }
  }
  console.log(`ǩ������,��ʼ����������`);
  if (!$.farmTask.gotBrowseTaskAdInit.f) {
    let adverts = $.farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
    let browseReward = 0
    let browseSuccess = 0
    let browseFail = 0
    for (let advert of adverts) { //��ʼ������
      if (advert.limit <= advert.hadFinishedTimes) {
        // browseReward+=advert.reward
        console.log(`${advert.mainTitle}+ ' �����`);
        continue;
      }
      console.log('���ڽ��й���������: ' + advert.mainTitle);
      await browseAdTaskForFarm(advert.advertId, 0);
      if ($.browseResult.code === '0') {
        console.log(`${advert.mainTitle}����������`);
        //��ȡ����
        await browseAdTaskForFarm(advert.advertId, 1);
        if ($.browseRwardResult.code === '0') {
          console.log(`��ȡ���${advert.mainTitle}��潱���ɹ�,���${$.browseRwardResult.amount}g`)
          browseReward += $.browseRwardResult.amount
          browseSuccess++
        } else {
          browseFail++
          console.log(`��ȡ�����潱�����:  ${JSON.stringify($.browseRwardResult)}`)
        }
      } else {
        browseFail++
        console.log(`������������:   ${JSON.stringify($.browseResult)}`);
      }
    }
    if (browseFail > 0) {
      console.log(`�������������${browseSuccess}��,ʧ��${browseFail},���${browseReward}g?\\n`);
      // message += `�������������${browseSuccess}��,ʧ��${browseFail},���${browseReward}g?\n`;
    } else {
      console.log(`�������������${browseSuccess}��,���${browseReward}g?\n`);
      // message += `�������������${browseSuccess}��,���${browseReward}g?\n`;
    }
  } else {
    console.log(`�����Ѿ���������������\n`);
  }
  //��ʱ��ˮ
  if (!$.farmTask.gotThreeMealInit.f) {
    //
    await gotThreeMealForFarm();
    if ($.threeMeal.code === "0") {
      console.log(`����ʱ��ˮ�����${$.threeMeal.amount}g?\n`);
      // message += `����ʱ��ˮ�����${$.threeMeal.amount}g?\n`;
    } else {
      // message += `����ʱ��ˮ��ʧ��,��ѯ��־\n`;
      console.log(`��ʱ��ˮ�ɹ����:  ${JSON.stringify($.threeMeal)}`);
    }
  } else {
    console.log('��ǰ���ڶ�ʱ��ˮʱ��ϻ����Ѿ����\n')
  }
  //�����ѽ�ˮ
  if (!$.farmTask.waterFriendTaskInit.f) {
    if ($.farmTask.waterFriendTaskInit.waterFriendCountKey < $.farmTask.waterFriendTaskInit.waterFriendMax) {
      await doFriendsWater();
    }
  } else {
    console.log(`��${$.farmTask.waterFriendTaskInit.waterFriendMax}�����ѽ�ˮ���������\n`)
  }
  // await Promise.all([
  //   clockInIn(),//����ˮ
  //   executeWaterRains(),//ˮ����
  //   masterHelpShare(),//��������
  //   getExtraAward(),//��ȡ����ˮ�ν���
  //   turntableFarm()//����齱�ú���
  // ])
  await getAwardInviteFriend();
  await clockInIn();//����ˮ
  await executeWaterRains();//ˮ����
  await getExtraAward();//��ȡ����ˮ�ν���
  await turntableFarm()//����齱�ú���
}

async function predictionFruit() {
  console.log('��ʼԤ��ˮ������ʱ��\n');
  await initForFarm();
  await taskInitForFarm();
  let waterEveryDayT = $.farmTask.totalWaterTaskInit.totalWaterTaskTimes;//���쵽��ĿǰΪֹ�����˶��ٴ�ˮ
  message += `�����չ���ˮ��${waterEveryDayT}��\n`;
  message += `��ʣ�� ˮ�Ρ�${$.farmInfo.farmUserPro.totalEnergy}g?\n`;
  message += `��ˮ��?���ȡ�${(($.farmInfo.farmUserPro.treeEnergy / $.farmInfo.farmUserPro.treeTotalEnergy) * 100).toFixed(2)}%���ѽ�ˮ${$.farmInfo.farmUserPro.treeEnergy / 10}��,����${($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10}��\n`
  if ($.farmInfo.toFlowTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
    message += `���������ȡ��ٽ�ˮ${$.farmInfo.toFlowTimes - $.farmInfo.farmUserPro.treeEnergy / 10}�ο���\n`
  } else if ($.farmInfo.toFruitTimes > ($.farmInfo.farmUserPro.treeEnergy / 10)) {
    message += `��������ȡ��ٽ�ˮ${$.farmInfo.toFruitTimes - $.farmInfo.farmUserPro.treeEnergy / 10}�ν��\n`
  }
  // Ԥ��n���ˮ���οɶһ�����
  let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy - $.farmInfo.farmUserPro.totalEnergy) / 10;//һ�����载���ٴ�ˮ

  let waterD = Math.ceil(waterTotalT / waterEveryDayT);

  message += `��Ԥ�⡿${waterD === 1 ? '����' : waterD === 2 ? '����' : waterD + '��֮��'}(${timeFormat(24 * 60 * 60 * 1000 * waterD + Date.now())}��)�ɶһ�ˮ��?`
}
//��ˮʮ��
async function doTenWater() {
  jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
  if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
    jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
  }
  await myCardInfoForFarm();
  const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
  if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match(`��ʱ����`) && beanCard > 0) {
    console.log(`�����õ���ʹ��ˮ�λ��������ұ�����ˮ�λ�����${beanCard}��, ����10�ν�ˮ����`)
    return
  }
  if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    console.log(`\n׼����ˮʮ��`);
    let waterCount = 0;
    isFruitFinished = false;
    for (; waterCount < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit - $.farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
      console.log(`��${waterCount + 1}�ν�ˮ`);
      await waterGoodForFarm();
      console.log(`���ν�ˮ���:   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log(`ʣ��ˮ��${$.waterResult.totalEnergy}g`);
        if ($.waterResult.finished) {
          // ��֤ʵ��waterResult.finishedΪtrue����ʾˮ������ȥ��ȡ�һ���
          isFruitFinished = true;
          break
        } else {
          if ($.waterResult.totalEnergy < 10) {
            console.log(`ˮ�β�����������ˮ`)
            break
          }
          await gotStageAward();//��ȡ�׶���ˮ�ν���
        }
      } else {
        console.log('��ˮ����ʧ���쳣,�������ڼ�����ˮ')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `�������˺�${$.index}��${$.nickName || $.UserName}\n������?��${$.farmInfo.farmUserPro.name}�ѿ���ȡ\n��ȥ����APP��΢��С����鿴\n�����������`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - �˺�${$.index} - ${$.nickName || $.UserName}ˮ���ѿ���ȡ`, `�����˺�${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}�ѿ���ȡ`);
      }
    }
  } else {
    console.log('\n���������10�ν�ˮ����\n');
  }
}
//��ȡ�״ν�ˮ����
async function getFirstWaterAward() {
  await taskInitForFarm();
  //��ȡ�״ν�ˮ����
  if (!$.farmTask.firstWaterInit.f && $.farmTask.firstWaterInit.totalWaterTimes > 0) {
    await firstWaterTaskForFarm();
    if ($.firstWaterReward.code === '0') {
      console.log(`���״ν�ˮ���������${$.firstWaterReward.amount}g?\n`);
      // message += `���״ν�ˮ���������${$.firstWaterReward.amount}g?\n`;
    } else {
      // message += '���״ν�ˮ��������ȡ����ʧ��,��ѯ��־\n';
      console.log(`��ȡ�״ν�ˮ�������:  ${JSON.stringify($.firstWaterReward)}`);
    }
  } else {
    console.log('�״ν�ˮ��������ȡ\n')
  }
}
//��ȡʮ�ν�ˮ����
async function getTenWaterAward() {
  //��ȡ10�ν�ˮ����
  if (!$.farmTask.totalWaterTaskInit.f && $.farmTask.totalWaterTaskInit.totalWaterTaskTimes >= $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    await totalWaterTaskForFarm();
    if ($.totalWaterReward.code === '0') {
      console.log(`��ʮ�ν�ˮ���������${$.totalWaterReward.totalWaterTaskEnergy}g?\n`);
      // message += `��ʮ�ν�ˮ���������${$.totalWaterReward.totalWaterTaskEnergy}g?\n`;
    } else {
      // message += '��ʮ�ν�ˮ��������ȡ����ʧ��,��ѯ��־\n';
      console.log(`��ȡ10�ν�ˮ�������:  ${JSON.stringify($.totalWaterReward)}`);
    }
  } else if ($.farmTask.totalWaterTaskInit.totalWaterTaskTimes < $.farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
    // message += `��ʮ�ν�ˮ����������δ��ɣ����ս�ˮ${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}��\n`;
    console.log(`��ʮ�ν�ˮ����������δ��ɣ����ս�ˮ${$.farmTask.totalWaterTaskInit.totalWaterTaskTimes}��\n`);
  }
  console.log('finished ˮ���������!');
}
//�ٴν�ˮ
async function doTenWaterAgain() {
  console.log('��ʼ���ʣ��ˮ���ܷ��ٴν�ˮ�ٴν�ˮ\n');
  await initForFarm();
  let totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
  console.log(`ʣ��ˮ��${totalEnergy}g\n`);
  await myCardInfoForFarm();
  const { fastCard, doubleCard, beanCard, signCard  } = $.myCardInfoRes;
  console.log(`�������е���:\n���ٽ�ˮ��:${fastCard === -1 ? 'δ����': fastCard + '��'}\nˮ�η�����:${doubleCard === -1 ? 'δ����': doubleCard + '��'}\nˮ�λ�������:${beanCard === -1 ? 'δ����' : beanCard + '��'}\n��ǩ��:${signCard === -1 ? 'δ����' : signCard + '��'}\n`)
  if (totalEnergy >= 100 && doubleCard > 0) {
    //ʹ�÷���ˮ�ο�
    for (let i = 0; i < new Array(doubleCard).fill('').length; i++) {
      await userMyCardForFarm('doubleCard');
      console.log(`ʹ�÷���ˮ�ο����:${JSON.stringify($.userMyCardRes)}`);
    }
    await initForFarm();
    totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  }
  if (signCard > 0) {
    //ʹ�ü�ǩ��
    for (let i = 0; i < new Array(signCard).fill('').length; i++) {
      await userMyCardForFarm('signCard');
      console.log(`ʹ�ü�ǩ�����:${JSON.stringify($.userMyCardRes)}`);
    }
    await initForFarm();
    totalEnergy = $.farmInfo.farmUserPro.totalEnergy;
  }
  jdFruitBeanCard = $.getdata('jdFruitBeanCard') ? $.getdata('jdFruitBeanCard') : jdFruitBeanCard;
  if ($.isNode() && process.env.FRUIT_BEAN_CARD) {
    jdFruitBeanCard = process.env.FRUIT_BEAN_CARD;
  }
  if (`${jdFruitBeanCard}` === 'true' && JSON.stringify($.myCardInfoRes).match('��ʱ����')) {
    console.log(`\n�����õ���ˮ�λ�������,����Ϊ������`);
    if (totalEnergy >= 100 && $.myCardInfoRes.beanCard > 0) {
      //ʹ��ˮ�λ�����
      await userMyCardForFarm('beanCard');
      console.log(`ʹ��ˮ�λ��������:${JSON.stringify($.userMyCardRes)}`);
      if ($.userMyCardRes.code === '0') {
        message += `��ˮ�λ����������${$.userMyCardRes.beanCount}������\n`;
        return
      }
    } else {
      console.log(`��Ŀǰˮ��:${totalEnergy}g,ˮ�λ�����${$.myCardInfoRes.beanCard}��,�ݲ�����ˮ�λ���������,Ϊ��������ˮ`)
    }
  }
  // if (totalEnergy > 100 && $.myCardInfoRes.fastCard > 0) {
  //   //ʹ�ÿ��ٽ�ˮ��
  //   await userMyCardForFarm('fastCard');
  //   console.log(`ʹ�ÿ��ٽ�ˮ�����:${JSON.stringify($.userMyCardRes)}`);
  //   if ($.userMyCardRes.code === '0') {
  //     console.log(`��ʹ�ÿ��ٽ�ˮ����ˮ${$.userMyCardRes.waterEnergy}g`);
  //   }
  //   await initForFarm();
  //   totalEnergy  = $.farmInfo.farmUserPro.totalEnergy;
  // }
  // ���еĽ�ˮ(10�ν�ˮ)���񣬻�ȡˮ��������ɺ����ʣ��ˮ�δ��ڵ���60g,�������ˮ(��������ˮ����������ɵڶ���Ľ�ˮ10�ε�����)
  let overageEnergy = totalEnergy - retainWater;
  if (totalEnergy >= ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy)) {
    //������е�ˮ�Σ�����ˮ���ɶһ�����ĶԵ�(Ҳ���ǰ�ˮ�ν��꣬ˮ�����ܶһ���)
    isFruitFinished = false;
    for (let i = 0; i < ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; i++) {
      await waterGoodForFarm();
      console.log(`���ν�ˮ���(ˮ�����ϾͿɶһ���):   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log('\n��ˮ10g�ɹ�\n');
        if ($.waterResult.finished) {
          // ��֤ʵ��waterResult.finishedΪtrue����ʾˮ������ȥ��ȡ�һ���
          isFruitFinished = true;
          break
        } else {
          console.log(`Ŀǰˮ�Ρ�${$.waterResult.totalEnergy}��g,������ˮ��ˮ�����ϾͿ��Զһ���`)
        }
      } else {
        console.log('��ˮ����ʧ���쳣,�������ڼ�����ˮ')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `�������˺�${$.index}��${$.nickName || $.UserName}\n������?��${$.farmInfo.farmUserPro.name}�ѿ���ȡ\n��ȥ����APP��΢��С����鿴\n�����������`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - �˺�${$.index} - ${$.nickName}ˮ���ѿ���ȡ`, `�����˺�${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}�ѿ���ȡ`);
      }
    }
  } else if (overageEnergy >= 10) {
    console.log("Ŀǰʣ��ˮ�Σ���" + totalEnergy + "��g���ɼ�����ˮ");
    isFruitFinished = false;
    for (let i = 0; i < parseInt(overageEnergy / 10); i++) {
      await waterGoodForFarm();
      console.log(`���ν�ˮ���:   ${JSON.stringify($.waterResult)}`);
      if ($.waterResult.code === '0') {
        console.log(`\n��ˮ10g�ɹ�,ʣ��${$.waterResult.totalEnergy}\n`)
        if ($.waterResult.finished) {
          // ��֤ʵ��waterResult.finishedΪtrue����ʾˮ������ȥ��ȡ�һ���
          isFruitFinished = true;
          break
        } else {
          await gotStageAward()
        }
      } else {
        console.log('��ˮ����ʧ���쳣,�������ڼ�����ˮ')
        break;
      }
    }
    if (isFruitFinished) {
      option['open-url'] = urlSchema;
      $.msg($.name, ``, `�������˺�${$.index}��${$.nickName || $.UserName}\n������?��${$.farmInfo.farmUserPro.name}�ѿ���ȡ\n��ȥ����APP��΢��С����鿴\n�����������`, option);
      $.done();
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - �˺�${$.index} - ${$.nickName}ˮ���ѿ���ȡ`, `�����˺�${$.index} ${$.nickName}\n${$.farmInfo.farmUserPro.name}�ѿ���ȡ`);
      }
    }
  } else {
    console.log("Ŀǰʣ��ˮ�Σ���" + totalEnergy + "��g,���ټ�����ˮ,��������ˮ��������ɵڶ��졾ʮ�ν�ˮ��ˮ�Ρ�����")
  }
}
//��ȡ�׶���ˮ�ν���
function gotStageAward() {
  return new Promise(async resolve => {
    if ($.waterResult.waterStatus === 0 && $.waterResult.treeEnergy === 10) {
      console.log('������ѿ��,����30gˮ��');
      await gotStageAwardForFarm('1');
      console.log(`��ˮ�׶ν���1��ȡ��� ${JSON.stringify($.gotStageAwardForFarmRes)}`);
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `��������ѿ�ˡ�����${$.gotStageAwardForFarmRes.addEnergy}\n`;
        console.log(`��������ѿ�ˡ�����${$.gotStageAwardForFarmRes.addEnergy}\n`);
      }
    } else if ($.waterResult.waterStatus === 1) {
      console.log('����������,����40gˮ��');
      await gotStageAwardForFarm('2');
      console.log(`��ˮ�׶ν���2��ȡ��� ${JSON.stringify($.gotStageAwardForFarmRes)}`);
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `�����������ˡ�����${$.gotStageAwardForFarmRes.addEnergy}g?\n`;
        console.log(`�����������ˡ�����${$.gotStageAwardForFarmRes.addEnergy}g?\n`);
      }
    } else if ($.waterResult.waterStatus === 2) {
      console.log('��������С������, ����50gˮ��');
      await gotStageAwardForFarm('3');
      console.log(`��ˮ�׶ν���3��ȡ��� ${JSON.stringify($.gotStageAwardForFarmRes)}`)
      if ($.gotStageAwardForFarmRes.code === '0') {
        // message += `����������ˡ�����${$.gotStageAwardForFarmRes.addEnergy}g?\n`;
        console.log(`����������ˡ�����${$.gotStageAwardForFarmRes.addEnergy}g?\n`);
      }
    }
    resolve()
  })
}
//����齱�
async function turntableFarm() {
  await initForTurntableFarm();
  if ($.initForTurntableFarmRes.code === '0') {
    //��ȡ��ʱ���� //4Сʱһ��
    let {timingIntervalHours, timingLastSysTime, sysTime, timingGotStatus, remainLotteryTimes, turntableInfos} = $.initForTurntableFarmRes;

    if (!timingGotStatus) {
      console.log(`�Ƿ�����ȡ������͵ĳ齱����----${sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)}`)
      if (sysTime > (timingLastSysTime + 60*60*timingIntervalHours*1000)) {
        await timingAwardForTurntableFarm();
        console.log(`��ȡ��ʱ�������${JSON.stringify($.timingAwardRes)}`);
        await initForTurntableFarm();
        remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
      } else {
        console.log(`������͵ĳ齱����δ��ʱ��`)
      }
    } else {
      console.log('4Сʱ��������͵ĳ齱��������ȡ')
    }
    if ($.initForTurntableFarmRes.turntableBrowserAds && $.initForTurntableFarmRes.turntableBrowserAds.length > 0) {
      for (let index = 0; index < $.initForTurntableFarmRes.turntableBrowserAds.length; index++) {
        if (!$.initForTurntableFarmRes.turntableBrowserAds[index].status) {
          console.log(`��ʼ�������齱�ĵ�${index + 1}����᳡����`)
          await browserForTurntableFarm(1, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
          if ($.browserForTurntableFarmRes.code === '0' && $.browserForTurntableFarmRes.status) {
            console.log(`��${index + 1}����᳡������ɣ���ʼ��ȡˮ�ν���\n`)
            await browserForTurntableFarm(2, $.initForTurntableFarmRes.turntableBrowserAds[index].adId);
            if ($.browserForTurntableFarmRes.code === '0') {
              console.log(`��${index + 1}����᳡������ȡˮ�ν������\n`)
              await initForTurntableFarm();
              remainLotteryTimes = $.initForTurntableFarmRes.remainLotteryTimes;
            }
          }
        } else {
          console.log(`�������齱�ĵ�${index + 1}����᳡���������`)
        }
      }
    }
    //����齱����
    console.log('��ʼ����齱--��������--ÿ��ÿ��ֻ��������������.')
    for (let code of newShareCodes) {
      if (code === $.farmInfo.farmUserPro.shareCode) {
        console.log('����齱-�����Լ����Լ�����\n')
        continue
      }
      await lotteryMasterHelp(code);
      // console.log('����齱�������',lotteryMasterHelpRes.helpResult)
      if ($.lotteryMasterHelpRes.helpResult.code === '0') {
        console.log(`����齱-����${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}�ɹ�\n`)
      } else if ($.lotteryMasterHelpRes.helpResult.code === '11') {
        console.log(`����齱-��Ҫ�ظ�����${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}\n`)
      } else if ($.lotteryMasterHelpRes.helpResult.code === '13') {
        console.log(`����齱-����${$.lotteryMasterHelpRes.helpResult.masterUserInfo.nickName}ʧ��,���������ľ�\n`);
        break;
      }
    }
    console.log(`---����齱����remainLotteryTimes----${remainLotteryTimes}��`)
    //�齱
    if (remainLotteryTimes > 0) {
      console.log('��ʼ�齱')
      let lotteryResult = '';
      for (let i = 0; i < new Array(remainLotteryTimes).fill('').length; i++) {
        await lotteryForTurntableFarm()
        console.log(`��${i + 1}�γ齱���${JSON.stringify($.lotteryRes)}`);
        if ($.lotteryRes.code === '0') {
          turntableInfos.map((item) => {
            if (item.type === $.lotteryRes.type) {
              console.log(`lotteryRes.type${$.lotteryRes.type}`);
              if ($.lotteryRes.type.match(/bean/g) && $.lotteryRes.type.match(/bean/g)[0] === 'bean') {
                lotteryResult += `${item.name}����`;
              } else if ($.lotteryRes.type.match(/water/g) && $.lotteryRes.type.match(/water/g)[0] === 'water') {
                lotteryResult += `${item.name}��`;
              } else {
                lotteryResult += `${item.name}��`;
              }
            }
          })
          //û�д�����
          if ($.lotteryRes.remainLotteryTimes === 0) {
            break
          }
        }
      }
      if (lotteryResult) {
        console.log(`������齱��${lotteryResult.substr(0, lotteryResult.length - 1)}\n`)
        // message += `������齱��${lotteryResult.substr(0, lotteryResult.length - 1)}\n`;
      }
    }  else {
      console.log('����齱--�齱����Ϊ0��')
    }
  } else {
    console.log('��ʼ������齱�ú���ʧ��')
  }
}

//��ȡ���⽱��ˮ��
async function getExtraAward() {
  await masterHelpTaskInitForFarm();
  if ($.masterHelpResult.code === '0') {
    if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length >= 5) {
      // ����������������ȡ������Ľ���
      if (!$.masterHelpResult.masterGotFinal) {
        await masterGotFinishedTaskForFarm();
        if ($.masterGotFinished.code === '0') {
          console.log(`�ѳɹ���ȡ����������������${$.masterGotFinished.amount}��gˮ`);
          message += `�����⽱����${$.masterGotFinished.amount}gˮ��ȡ�ɹ�\n`;
        }
      } else {
        console.log("�Ѿ���ȡ��5�����������⽱��");
        message += `�����⽱�����ѱ���ȡ��\n`;
      }
    } else {
      console.log("��������δ�ﵽ5��");
      message += `�����⽱������ȡʧ��,ԭ�򣺸�����������δ��5��\n`;
    }
    if ($.masterHelpResult.masterHelpPeoples && $.masterHelpResult.masterHelpPeoples.length > 0) {
      let str = '';
      $.masterHelpResult.masterHelpPeoples.map((item, index) => {
        if (index === ($.masterHelpResult.masterHelpPeoples.length - 1)) {
          str += item.nickName || "�����û�";
        } else {
          str += (item.nickName || "�����û�") + ',';
        }
        let date = new Date(item.time);
        let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getMinutes();
        console.log(`\n�����ǳơ�${item.nickName || "�����û�"}�� �� ${time} ����������\n`);
      })
      message += `���������ĺ��ѡ�${str}\n`;
    }
    console.log('��ȡ���⽱��ˮ�ν���\n');
  }
}

//ˮ����
async function executeWaterRains() {
  let executeWaterRain = !$.farmTask.waterRainInit.f;
  if (executeWaterRain) {
    console.log(`ˮ��������ÿ�����Σ����ɵ�10gˮ��`);
    console.log(`����ˮ���������Ƿ�ȫ����ɣ�${$.farmTask.waterRainInit.f ? '��' : '��'}`);
    if ($.farmTask.waterRainInit.lastTime) {
      if (Date.now() < ($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000)) {
        executeWaterRain = false;
        // message += `����${$.farmTask.waterRainInit.winTimes + 1}��ˮ���꡿δ��ʱ�䣬��${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}����\n`;
        console.log(`\`����${$.farmTask.waterRainInit.winTimes + 1}��ˮ���꡿δ��ʱ�䣬��${new Date($.farmTask.waterRainInit.lastTime + 3 * 60 * 60 * 1000).toLocaleTimeString()}����\n`);
      }
    }
    if (executeWaterRain) {
      console.log(`��ʼˮ��������,���ǵ�${$.farmTask.waterRainInit.winTimes + 1}�Σ�ʣ��${2 - ($.farmTask.waterRainInit.winTimes + 1)}��`);
      await waterRainForFarm();
      console.log('ˮ����waterRain');
      if ($.waterRain.code === '0') {
        console.log('ˮ��������ִ�гɹ������ˮ�Σ�' + $.waterRain.addEnergy + 'g');
        console.log(`����${$.farmTask.waterRainInit.winTimes + 1}��ˮ���꡿���${$.waterRain.addEnergy}gˮ��\n`);
        // message += `����${$.farmTask.waterRainInit.winTimes + 1}��ˮ���꡿���${$.waterRain.addEnergy}gˮ��\n`;
      }
    }
  } else {
    // message += `��ˮ���꡿��ȫ����ɣ����20g?\n`;
  }
}

//����ˮ�
async function clockInIn() {
  console.log('��ʼ����ˮ���ǩ������ע����ȯ��');
  await clockInInitForFarm();
  if ($.clockInInit.code === '0') {
    // ǩ����ˮ��
    if (!$.clockInInit.todaySigned) {
      console.log('��ʼ����ǩ��');
      await clockInForFarm();
      console.log(`�򿨽��${JSON.stringify($.clockInForFarmRes)}`);
      if ($.clockInForFarmRes.code === '0') {
        // message += `����${$.clockInForFarmRes.signDay}��ǩ�������${$.clockInForFarmRes.amount}g?\n`;
        console.log(`����${$.clockInForFarmRes.signDay}��ǩ�������${$.clockInForFarmRes.amount}g?\n`)
        if ($.clockInForFarmRes.signDay === 7) {
          //������ȡ��ϲ���
          console.log('��ʼ��ȡ--��ϲ���38gˮ��');
          await gotClockInGift();
          if ($.gotClockInGiftRes.code === '0') {
            // message += `����ϲ��������${$.gotClockInGiftRes.amount}g?\n`;
            console.log(`����ϲ��������${$.gotClockInGiftRes.amount}g?\n`);
          }
        }
      }
    }
    if ($.clockInInit.todaySigned && $.clockInInit.totalSigned === 7) {
      console.log('��ʼ��ȡ--��ϲ���38gˮ��');
      await gotClockInGift();
      if ($.gotClockInGiftRes.code === '0') {
        // message += `����ϲ��������${$.gotClockInGiftRes.amount}g?\n`;
        console.log(`����ϲ��������${$.gotClockInGiftRes.amount}g?\n`);
      }
    }
    // ��ʱ��ע��ˮ��
    if ($.clockInInit.themes && $.clockInInit.themes.length > 0) {
      for (let item of $.clockInInit.themes) {
        if (!item.hadGot) {
          console.log(`��עID${item.id}`);
          await clockInFollowForFarm(item.id, "theme", "1");
          console.log(`themeStep1--���${JSON.stringify($.themeStep1)}`);
          if ($.themeStep1.code === '0') {
            await clockInFollowForFarm(item.id, "theme", "2");
            console.log(`themeStep2--���${JSON.stringify($.themeStep2)}`);
            if ($.themeStep2.code === '0') {
              console.log(`��ע${item.name}�����ˮ��${$.themeStep2.amount}g`);
            }
          }
        }
      }
    }
    // ��ʱ��ȯ��ˮ��
    if ($.clockInInit.venderCoupons && $.clockInInit.venderCoupons.length > 0) {
      for (let item of $.clockInInit.venderCoupons) {
        if (!item.hadGot) {
          console.log(`��ȯ��ID${item.id}`);
          await clockInFollowForFarm(item.id, "venderCoupon", "1");
          console.log(`venderCouponStep1--���${JSON.stringify($.venderCouponStep1)}`);
          if ($.venderCouponStep1.code === '0') {
            await clockInFollowForFarm(item.id, "venderCoupon", "2");
            if ($.venderCouponStep2.code === '0') {
              console.log(`venderCouponStep2--���${JSON.stringify($.venderCouponStep2)}`);
              console.log(`��${item.name}��ȯ�����ˮ��${$.venderCouponStep2.amount}g`);
            }
          }
        }
      }
    }
  }
  console.log('��ʼ����ˮ���ǩ������ע����ȯ������\n');
}
//
async function getAwardInviteFriend() {
  await friendListInitForFarm();//��ѯ�����б�
  // console.log(`��ѯ�����б����ݣ�${JSON.stringify($.friendList)}\n`)
  if ($.friendList) {
    console.log(`\n�������������${$.friendList.inviteFriendCount}�� / ÿ����������${$.friendList.inviteFriendMax}��`);
    console.log(`��ʼɾ��${$.friendList.friends && $.friendList.friends.length}������,����ÿ������뽱��`);
    if ($.friendList.friends && $.friendList.friends.length > 0) {
      for (let friend of $.friendList.friends) {
        console.log(`\n��ʼɾ������ [${friend.shareCode}]`);
        const deleteFriendForFarm = await request('deleteFriendForFarm', { "shareCode": `${friend.shareCode}`,"version":8,"channel":1 });
        if (deleteFriendForFarm && deleteFriendForFarm.code === '0') {
          console.log(`ɾ������ [${friend.shareCode}] �ɹ�\n`);
        }
      }
    }
    await receiveFriendInvite();//Ϊ��������,���������Ϊ���˵ĺ���
    if ($.friendList.inviteFriendCount > 0) {
      if ($.friendList.inviteFriendCount > $.friendList.inviteFriendGotAwardCount) {
        console.log('��ʼ��ȡ������ѵĽ���');
        await awardInviteFriendForFarm();
        console.log(`��ȡ������ѵĽ����������${JSON.stringify($.awardInviteFriendRes)}`);
      }
    } else {
      console.log('����δ���������')
    }
  } else {
    console.log(`��ѯ�����б�ʧ��\n`);
  }
}
//�����ѽ�ˮ
async function doFriendsWater() {
  await friendListInitForFarm();
  console.log('��ʼ�����ѽ�ˮ...');
  await taskInitForFarm();
  const { waterFriendCountKey, waterFriendMax } = $.farmTask.waterFriendTaskInit;
  console.log(`�����Ѹ�${waterFriendCountKey}�����ѽ�ˮ`);
  if (waterFriendCountKey < waterFriendMax) {
    let needWaterFriends = [];
    if ($.friendList.friends && $.friendList.friends.length > 0) {
      $.friendList.friends.map((item, index) => {
        if (item.friendState === 1) {
          if (needWaterFriends.length < (waterFriendMax - waterFriendCountKey)) {
            needWaterFriends.push(item.shareCode);
          }
        }
      });
      console.log(`��Ҫ��ˮ�ĺ����б�shareCodes:${JSON.stringify(needWaterFriends)}`);
      let waterFriendsCount = 0, cardInfoStr = '';
      for (let index = 0; index < needWaterFriends.length; index ++) {
        await waterFriendForFarm(needWaterFriends[index]);
        console.log(`Ϊ��${index+1}�����ѽ�ˮ���:${JSON.stringify($.waterFriendForFarmRes)}\n`)
        if ($.waterFriendForFarmRes.code === '0') {
          waterFriendsCount ++;
          if ($.waterFriendForFarmRes.cardInfo) {
            console.log('Ϊ���ѽ�ˮ��õ�����');
            if ($.waterFriendForFarmRes.cardInfo.type === 'beanCard') {
              console.log(`��ȡ���߿�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `ˮ�λ�����,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'fastCard') {
              console.log(`��ȡ���߿�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `���ٽ�ˮ��,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'doubleCard') {
              console.log(`��ȡ���߿�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `ˮ�η�����,`;
            } else if ($.waterFriendForFarmRes.cardInfo.type === 'signCard') {
              console.log(`��ȡ���߿�:${$.waterFriendForFarmRes.cardInfo.rule}`);
              cardInfoStr += `��ǩ��,`;
            }
          }
        } else if ($.waterFriendForFarmRes.code === '11') {
          console.log('ˮ�β���,������ˮ')
        }
      }
      // message += `�����ѽ�ˮ���Ѹ�${waterFriendsCount}�����ѽ�ˮ,����${waterFriendsCount * 10}gˮ\n`;
      console.log(`�����ѽ�ˮ���Ѹ�${waterFriendsCount}�����ѽ�ˮ,����${waterFriendsCount * 10}gˮ\n`);
      if (cardInfoStr && cardInfoStr.length > 0) {
        // message += `�����ѽ�ˮ������${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`;
        console.log(`�����ѽ�ˮ������${cardInfoStr.substr(0, cardInfoStr.length - 1)}\n`);
      }
    } else {
      console.log('���ĺ����б����޺���,��ȥ�������ĺ��Ѱ�!')
    }
  } else {
    console.log(`������Ϊ���ѽ�ˮ���Ѵ�${waterFriendMax}��`)
  }
}
//��ȡ��3�����ѽ�ˮ��Ľ���ˮ��
async function getWaterFriendGotAward() {
  await taskInitForFarm();
  const { waterFriendCountKey, waterFriendMax, waterFriendSendWater, waterFriendGotAward } = $.farmTask.waterFriendTaskInit
  if (waterFriendCountKey >= waterFriendMax) {
    if (!waterFriendGotAward) {
      await waterFriendGotAwardForFarm();
      console.log(`��ȡ��${waterFriendMax}�����ѽ�ˮ��Ľ���ˮ��::${JSON.stringify($.waterFriendGotAwardRes)}`)
      if ($.waterFriendGotAwardRes.code === '0') {
        // message += `����${waterFriendMax}���ѽ�ˮ������${$.waterFriendGotAwardRes.addWater}gˮ��\n`;
        console.log(`����${waterFriendMax}���ѽ�ˮ������${$.waterFriendGotAwardRes.addWater}gˮ��\n`);
      }
    } else {
      console.log(`�����ѽ�ˮ��${waterFriendSendWater}gˮ�ν�������ȡ\n`);
      // message += `����${waterFriendMax}���ѽ�ˮ������${waterFriendSendWater}gˮ������ȡ\n`;
    }
  } else {
    console.log(`��δ��${waterFriendMax}�����ѽ�ˮ\n`);
  }
}
//���ճ�Ϊ�Է����ѵ�����
async function receiveFriendInvite() {
  for (let code of newShareCodes) {
    if (code === $.farmInfo.farmUserPro.shareCode) {
      console.log('�Լ����������Լ���Ϊ������\n')
      continue
    }
    await inviteFriend(code);
    // console.log(`���������Ϊ���ѽ��:${JSON.stringify($.inviteFriendRes)}`)
    if ($.inviteFriendRes && $.inviteFriendRes.helpResult && $.inviteFriendRes.helpResult.code === '0') {
      console.log(`���������Ϊ���ѽ���ɹ�,���ѳ�Ϊ${$.inviteFriendRes.helpResult.masterUserInfo.nickName}�ĺ���`)
    } else if ($.inviteFriendRes.helpResult.code === '17') {
      console.log(`���������Ϊ���ѽ��ʧ��,�Է��������ĺ���`)
    }
  }
  // console.log(`��ʼ����6fbd26cc27ac44d6a7fed34092453f77������\n`)
  // await inviteFriend('6fbd26cc27ac44d6a7fed34092453f77');
  // console.log(`���������Ϊ���ѽ��:${JSON.stringify($.inviteFriendRes.helpResult)}`)
  // if ($.inviteFriendRes.helpResult.code === '0') {
  //   console.log(`���ѳ�Ϊ${$.inviteFriendRes.helpResult.masterUserInfo.nickName}�ĺ���`)
  // } else if ($.inviteFriendRes.helpResult.code === '17') {
  //   console.log(`�Է��������ĺ���`)
  // }
}
async function duck() {
  for (let i = 0; i < 10; i++) {
    //����ѭ��ʮ��
    await getFullCollectionReward();
    if ($.duckRes.code === '0') {
      if (!$.duckRes.hasLimit) {
        console.log(`СѼ����Ϸ:${$.duckRes.title}`);
        // if ($.duckRes.type !== 3) {
        //   console.log(`${$.duckRes.title}`);
        //   if ($.duckRes.type === 1) {
        //     message += `��СѼ�ӡ�Ϊ�������ˮ��\n`;
        //   } else if ($.duckRes.type === 2) {
        //     message += `��СѼ�ӡ�Ϊ����ؿ��ٽ�ˮ��\n`
        //   }
        // }
      } else {
        console.log(`${$.duckRes.title}`)
        break;
      }
    } else if ($.duckRes.code === '10') {
      console.log(`СѼ����Ϸ�ﵽ����`)
      break;
    }
  }
}
// ========================API���ýӿ�========================
//Ѽ�ӣ������о�ϲ
async function getFullCollectionReward() {
  return new Promise(resolve => {
    const body = {"type": 2, "version": 6, "channel": 2};
    $.post(taskUrl("getFullCollectionReward", body), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n����ũ��: API��ѯ����ʧ�� ????');
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.duckRes = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

/**
 * ��ȡ10�ν�ˮ����API
 */
async function totalWaterTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.totalWaterReward = await request(functionId);
}
//��ȡ�״ν�ˮ����API
async function firstWaterTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.firstWaterReward = await request(functionId);
}
//��ȡ��3�����ѽ�ˮ��Ľ���ˮ��API
async function waterFriendGotAwardForFarm() {
  const functionId = arguments.callee.name.toString();
  $.waterFriendGotAwardRes = await request(functionId, {"version": 4, "channel": 1});
}
// ��ѯ�������߿�API
async function myCardInfoForFarm() {
  const functionId = arguments.callee.name.toString();
  $.myCardInfoRes = await request(functionId, {"version": 5, "channel": 1});
}
//ʹ�õ��߿�API
async function userMyCardForFarm(cardType) {
  const functionId = arguments.callee.name.toString();
  $.userMyCardRes = await request(functionId, {"cardType": cardType});
}
/**
 * ��ȡ��ˮ�����еĽ׶��Խ���
 * @param type
 * @returns {Promise<void>}
 */
async function gotStageAwardForFarm(type) {
  $.gotStageAwardForFarmRes = await request(arguments.callee.name.toString(), {'type': type});
}
//��ˮAPI
async function waterGoodForFarm() {
  await $.wait(1000);
  console.log('�ȴ���1��');

  const functionId = arguments.callee.name.toString();
  $.waterResult = await request(functionId);
}
// ��ʼ�������齱�����API
async function initForTurntableFarm() {
  $.initForTurntableFarmRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}
async function lotteryForTurntableFarm() {
  await $.wait(2000);
  console.log('�ȴ���2��');
  $.lotteryRes = await request(arguments.callee.name.toString(), {type: 1, version: 4, channel: 1});
}

async function timingAwardForTurntableFarm() {
  $.timingAwardRes = await request(arguments.callee.name.toString(), {version: 4, channel: 1});
}

async function browserForTurntableFarm(type, adId) {
  if (type === 1) {
    console.log('�����Ʒ�᳡');
  }
  if (type === 2) {
    console.log('����齱���������ȡˮ��');
  }
  const body = {"type": type,"adId": adId,"version":4,"channel":1};
  $.browserForTurntableFarmRes = await request(arguments.callee.name.toString(), body);
  // �����Ʒ�᳡8��
}
//����齱���������ȡˮ��API
async function browserForTurntableFarm2(type) {
  const body = {"type":2,"adId": type,"version":4,"channel":1};
  $.browserForTurntableFarm2Res = await request('browserForTurntableFarm', body);
}
/**
 * ����齱�ú���-����API(ÿ��ÿ��������������)
 */
async function lotteryMasterHelp() {
  $.lotteryMasterHelpRes = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0] + '-3',
    babelChannel: "3",
    version: 4,
    channel: 1
  });
}

//��ȡ5��������Ķ��⽱��API
async function masterGotFinishedTaskForFarm() {
  const functionId = arguments.callee.name.toString();
  $.masterGotFinished = await request(functionId);
}
//����������ϢAPI
async function masterHelpTaskInitForFarm() {
  const functionId = arguments.callee.name.toString();
  $.masterHelpResult = await request(functionId);
}
//���ܶԷ�����,��Ϊ�Է����ѵ�API
async function inviteFriend() {
  $.inviteFriendRes = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0] + '-inviteFriend',
    version: 4,
    channel: 2
  });
}
// ��������API
async function masterHelp() {
  $.helpResult = await request(`initForFarm`, {
    imageUrl: "",
    nickName: "",
    shareCode: arguments[0],
    babelChannel: "3",
    version: 2,
    channel: 1
  });
}
/**
 * ˮ����API
 */
async function waterRainForFarm() {
  const functionId = arguments.callee.name.toString();
  const body = {"type": 1, "hongBaoTimes": 100, "version": 3};
  $.waterRain = await request(functionId, body);
}
/**
 * ����ˮAPI
 */
async function clockInInitForFarm() {
  const functionId = arguments.callee.name.toString();
  $.clockInInit = await request(functionId);
}

// ����ǩ��API
async function clockInForFarm() {
  const functionId = arguments.callee.name.toString();
  $.clockInForFarmRes = await request(functionId, {"type": 1});
}

//��ע����ȯ��API
async function clockInFollowForFarm(id, type, step) {
  const functionId = arguments.callee.name.toString();
  let body = {
    id,
    type,
    step
  }
  if (type === 'theme') {
    if (step === '1') {
      $.themeStep1 = await request(functionId, body);
    } else if (step === '2') {
      $.themeStep2 = await request(functionId, body);
    }
  } else if (type === 'venderCoupon') {
    if (step === '1') {
      $.venderCouponStep1 = await request(functionId, body);
    } else if (step === '2') {
      $.venderCouponStep2 = await request(functionId, body);
    }
  }
}

// ��ȡ����ǩ��7��ľ�ϲ���API
async function gotClockInGift() {
  $.gotClockInGiftRes = await request('clockInForFarm', {"type": 2})
}

//��ʱ��ˮAPI
async function gotThreeMealForFarm() {
  const functionId = arguments.callee.name.toString();
  $.threeMeal = await request(functionId);
}
/**
 * ����������API
 * typeΪ0ʱ, ����������
 * typeΪ1ʱ, ��ȡ���������
 */
async function browseAdTaskForFarm(advertId, type) {
  const functionId = arguments.callee.name.toString();
  if (type === 0) {
    $.browseResult = await request(functionId, {advertId, type});
  } else if (type === 1) {
    $.browseRwardResult = await request(functionId, {advertId, type});
  }
}
// ��ˮ������API
async function gotWaterGoalTaskForFarm() {
  $.goalResult = await request(arguments.callee.name.toString(), {type: 3});
}
//ǩ��API
async function signForFarm() {
  const functionId = arguments.callee.name.toString();
  $.signResult = await request(functionId);
}
/**
 * ��ʼ��ũ��, �ɻ�ȡ�������û���ϢAPI
 */
async function initForFarm() {
  return new Promise(resolve => {
    const option =  {
      url: `${JD_API_HOST}?functionId=initForFarm`,
      body: `body=${escape(JSON.stringify({"version":4}))}&appid=wh5&clientVersion=9.1.0`,
      headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "cookie": cookie,
        "origin": "https://home.m.jd.com",
        "pragma": "no-cache",
        "referer": "https://home.m.jd.com/myJd/newhome.action",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 10000,
    };
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n����ũ��: API��ѯ����ʧ�� ????');
          console.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          if (safeGet(data)) {
            $.farmInfo = JSON.parse(data)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

// ��ʼ�������б�API
async function taskInitForFarm() {
  console.log('\n��ʼ�������б�')
  const functionId = arguments.callee.name.toString();
  $.farmTask = await request(functionId);
}
//��ȡ�����б�API
async function friendListInitForFarm() {
  $.friendList = await request('friendListInitForFarm', {"version": 4, "channel": 1});
  // console.log('aa', aa);
}
// ��ȡ������ѵĽ���API
async function awardInviteFriendForFarm() {
  $.awardInviteFriendRes = await request('awardInviteFriendForFarm');
}
//Ϊ���ѽ�ˮAPI
async function waterFriendForFarm(shareCode) {
  const body = {"shareCode": shareCode, "version": 6, "channel": 1}
  $.waterFriendForFarmRes = await request('waterFriendForFarm', body);
}
async function showMsg() {
  if ($.isNode() && process.env.FRUIT_NOTIFY_CONTROL) {
    $.ctrTemp = `${process.env.FRUIT_NOTIFY_CONTROL}` === 'false';
  } else if ($.getdata('jdFruitNotify')) {
    $.ctrTemp = $.getdata('jdFruitNotify') === 'false';
  } else {
    $.ctrTemp = `${jdNotify}` === 'false';
  }
  if ($.ctrTemp) {
    $.msg($.name, subTitle, message, option);
    if ($.isNode()) {
      allMessage += `${subTitle}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`;
      // await notify.sendNotify(`${$.name} - �˺�${$.index} - ${$.nickName}`, `${subTitle}\n${message}`);
    }
  } else {
    $.log(`\n${message}\n`);
  }
}

function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}
function readShareCode() {
  return new Promise(async resolve => {
    $.get({url: `http://jd.turinglabs.net/api/v2/jd/farm/read/${randomCount}/`, timeout: 10000,}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API����ʧ�ܣ�������·����`)
        } else {
          if (data) {
            console.log(`���ȡ��${randomCount}��ŵ����̶��Ļ��������(��Ӱ�����й̶�����)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      },
      "timeout": 10000,
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API����ʧ�ܣ�������·����`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie����
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`�������������ؿ�����`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function request(function_id, body = {}, timeout = 1000){
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskUrl(function_id, body), (err, resp, data) => {
        try {
          if (err) {
            console.log('\n����ũ��: API��ѯ����ʧ�� ????')
            console.log(JSON.stringify(err));
            console.log(`function_id:${function_id}`)
            $.logErr(err);
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`������������������Ϊ�գ����������豸�������`);
    return false;
  }
}
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
    headers: {
      Cookie: cookie,
      UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    },
    timeout: 10000,
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '����������BoxJs������޸�����\n����ͨ���ű�ȥ��ȡcookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`?${this.name}, ��ʼ!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============?ϵͳ֪ͨ?=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`??${this.name}, ����!`,t.stack):this.log("",`??${this.name}, ����!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`?${this.name}, ����! ? ${s} ��`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}